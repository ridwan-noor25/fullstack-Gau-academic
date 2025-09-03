// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthCtx = createContext(null);

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

function buildUrl(p) {
  return p.startsWith("http") ? p : `${API_BASE}${p}`;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [role, setRole] = useState(() => (localStorage.getItem("role") || "").toLowerCase());
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Fetch current user when we have a token (or on mount if already logged in)
  useEffect(() => {
    async function hydrate() {
      if (!token || !API_BASE) return;
      try {
        const r = await fetch(buildUrl("/auth/me"), {
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        });
        if (!r.ok) throw new Error(`me HTTP ${r.status}`);
        const data = await r.json();
        const current = data?.user || data;
        if (current) {
          setUser(current);
          const rle = (current.role || "").toLowerCase();
          setRole(rle);
          localStorage.setItem("user", JSON.stringify(current));
          if (rle) localStorage.setItem("role", rle);
        }
      } catch {
        // silently ignore (token may be expired)
      }
    }
    hydrate();
  }, [token]);

  async function login(email, password) {
    if (!API_BASE) throw new Error("VITE_API_BASE not set");
    const r = await fetch(buildUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
    let data = null;
    try { data = await r.json(); } catch {}
    if (!r.ok) {
      const msg = data?.error || data?.message || `Login failed (HTTP ${r.status})`;
      throw new Error(msg);
    }
    const tok = data?.access_token || data?.accessToken || data?.token;
    const usr = data?.user || data?.data || null;
    if (tok) {
      setToken(tok);
      localStorage.setItem("token", tok);
    }
    if (usr && typeof usr === "object") {
      setUser(usr);
      localStorage.setItem("user", JSON.stringify(usr));
      const rle = (usr.role || "").toLowerCase();
      if (rle) {
        setRole(rle);
        localStorage.setItem("role", rle);
      }
    }
    return { token: tok, user: usr };
  }

  function logout() {
    setUser(null);
    setRole("");
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }

  const value = useMemo(() => ({ user, role, token, login, logout }), [user, role, token]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
