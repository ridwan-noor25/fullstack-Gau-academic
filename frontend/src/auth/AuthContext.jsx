// src/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

// Create context
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Restore user/role/token when app starts
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      api.setToken(savedToken);
      if (savedRole) {
        setRole(savedRole.toLowerCase()); // ✅ normalize here
      }
      // Optional: fetch user profile for extra safety
      // api.request("/auth/me").then((profile) => setUser(profile));
    }
  }, []);

  // 🔑 Login
  async function login(email, password) {
    const { access_token, user } = await api.request("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    const normalizedRole = user.role?.toLowerCase() || "";

    // Save in API client + context
    api.setToken(access_token);
    setUser(user);
    setRole(normalizedRole);

    // Persist for reloads
    localStorage.setItem("token", access_token);
    localStorage.setItem("role", normalizedRole);

    return { user, access_token };
  }

  // 🚪 Logout
  function logout() {
    api.clearToken();
    setUser(null);
    setRole(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    // Redirect to home page after logout
    window.location.href = "/";
  }

  // Context value
  const value = {
    user,
    role,
    isAuthed: !!api.getToken(),
    login,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
