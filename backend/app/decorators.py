# app/decorators.py
from __future__ import annotations
from functools import wraps
from typing import Callable
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity


def role_required(*allowed_roles: str, allow_admin: bool = True) -> Callable:
    """
    Restrict access to users whose JWT 'role' is in allowed_roles.
    - Roles are matched case-insensitively.
    - If allow_admin=True, role=='admin' is always allowed.
    Usage:
        @role_required("lecturer")           # no need to also add @jwt_required()
        def route(): ...
    """
    allowed = {str(r).lower() for r in allowed_roles}

    def decorator(fn: Callable):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Ensures a valid JWT; will 401 automatically if missing/invalid
            verify_jwt_in_request()
            claims = get_jwt() or {}
            role = (claims.get("role") or "").lower()

            if allow_admin and role == "admin":
                return fn(*args, **kwargs)
            if role not in allowed:
                return jsonify({
                    "error": "forbidden: insufficient role",
                    "role": role,
                    "allowed": sorted(list(allowed)),
                    "admin_bypass": allow_admin
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def self_or_roles(
    *allowed_roles: str,
    allow_admin: bool = True,
    id_kw: str = "user_id",
) -> Callable:
    """
    Allow if:
      - requester's JWT identity matches the path kwarg id_kw (owner), OR
      - requester's role is in allowed_roles (case-insensitive), OR
      - allow_admin and role=='admin'.
    Usage (example):
        @self_or_roles("lecturer", id_kw="user_id")
        def get_user(user_id): ...
    """
    allowed = {str(r).lower() for r in allowed_roles}

    def decorator(fn: Callable):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt() or {}
            role = (claims.get("role") or "").lower()
            me = str(get_jwt_identity())
            target = kwargs.get(id_kw)
            target = str(target) if target is not None else None

            if allow_admin and role == "admin":
                return fn(*args, **kwargs)
            if target and me == target:
                return fn(*args, **kwargs)
            if role in allowed:
                return fn(*args, **kwargs)

            return jsonify({
                "error": "forbidden: owner or role required",
                "role": role,
                "allowed": sorted(list(allowed)),
                "me": me,
                "target": target,
                "admin_bypass": allow_admin,
                "id_kw": id_kw,
            }), 403
        return wrapper
    return decorator
