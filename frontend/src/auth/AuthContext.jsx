// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { api } from '../api'


// const AuthCtx = createContext(null)
// export const useAuth = () => useContext(AuthCtx)


// export default function AuthProvider({ children }) {
// const [user, setUser] = useState(null)
// const [role, setRole] = useState(null)


// useEffect(() => {
// // (optional) could validate token by pinging /api/health
// }, [])


// async function login(email, password) {
// const { access_token, user } = await api.request('/auth/login', {
// method: 'POST',
// body: { email, password }
// })
// api.setToken(access_token)
// setUser(user)
// setRole(user.role)
// }


// function logout() {
// api.clearToken();
// setUser(null); setRole(null)
// }


// const value = { user, role, isAuthed: !!api.getToken(), login, logout }
// return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
// }



// import React, { createContext, useContext, useEffect, useState } from 'react'
// import { api } from '../api'

// const AuthCtx = createContext(null)
// export const useAuth = () => useContext(AuthCtx)

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [role, setRole] = useState(null)

//   useEffect(() => {
//     // (optional) could validate token by pinging /api/health
//   }, [])

//   async function login(email, password) {
//     const { access_token, user } = await api.request('/auth/login', {
//       method: 'POST',
//       body: { email, password }
//     })
//     api.setToken(access_token)
//     setUser(user)
//     setRole(user.role)
//   }

//   function logout() {
//     api.clearToken();
//     setUser(null); setRole(null)
//     window.location.assign('/'); // ⭐ NEW: send them back to the home page
//   }

//   const value = { user, role, isAuthed: !!api.getToken(), login, logout }
//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
// }



// // src/auth/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { api } from "../api";

// // Create context
// const AuthCtx = createContext(null);
// export const useAuth = () => useContext(AuthCtx);

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   // Restore user/role/token when app starts
//   useEffect(() => {
//     const savedRole = localStorage.getItem("role");
//     const savedToken = localStorage.getItem("token");

//     if (savedToken) {
//       api.setToken(savedToken);
//       if (savedRole) {
//         setRole(savedRole);
//       }
//       // Optional: fetch user profile for extra safety
//       // api.request("/auth/me").then((profile) => setUser(profile));
//     }
//   }, []);

//   // 🔑 Login
//   async function login(email, password) {
//     const { access_token, user } = await api.request("/auth/login", {
//       method: "POST",
//       body: { email, password },
//     });

//     // Save in API client + context
//     api.setToken(access_token);
//     setUser(user);
//     setRole(user.role);

//     // Persist for reloads
//     localStorage.setItem("token", access_token);
//     localStorage.setItem("role", user.role);

//     return { user, access_token };
//   }

//   // 🚪 Logout
//   function logout() {
//     api.clearToken();
//     setUser(null);
//     setRole(null);

//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//   }

//   // Context value
//   const value = {
//     user,
//     role,
//     isAuthed: !!api.getToken(),
//     login,
//     logout,
//   };

//   return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
// }


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
