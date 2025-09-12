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



import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    // (optional) could validate token by pinging /api/health
  }, [])

  async function login(email, password) {
    const { access_token, user } = await api.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    api.setToken(access_token)
    setUser(user)
    setRole(user.role)
  }

  function logout() {
    api.clearToken();
    setUser(null); setRole(null)
    window.location.assign('/'); // ⭐ NEW: send them back to the home page
  }

  const value = { user, role, isAuthed: !!api.getToken(), login, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
