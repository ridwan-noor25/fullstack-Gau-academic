# app/decorators.py
from __future__ import annotations
from functools import wraps
from typing import Callable
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity


def role_required(*allowed_roles: str, allow_admin: bool = True):
    def decorator(fn: Callable):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt() or {}
            role = claims.get("role")
            if role is None:
                return jsonify({"error": "forbidden", "detail": "missing role claim"}), 403
            if allow_admin and role == "admin":
                return fn(*args, **kwargs)
            if role not in allowed_roles:
                return jsonify({
                    "error": "forbidden: insufficient role",
                    "role": role,
                    "allowed": list(allowed_roles)
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def self_or_roles(*allowed_roles: str, allow_admin: bool = True, id_kw: str = "user_id"):
    def decorator(fn: Callable):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt() or {}
            role = claims.get("role")
            me = str(get_jwt_identity())
            target = str(kwargs.get(id_kw))

            if allow_admin and role == "admin":
                return fn(*args, **kwargs)
            if target and me == target:
                return fn(*args, **kwargs)
            if role in allowed_roles:
                return fn(*args, **kwargs)

            return jsonify({
                "error": "forbidden: owner or role required",
                "role": role,
                "allowed": list(allowed_roles),
                "me": me,
                "target": target
            }), 403
        return wrapper
    return decorator
