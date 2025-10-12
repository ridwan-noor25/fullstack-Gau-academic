import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function RequireAuth({ roles, children }) {
const { isAuthed, role } = useAuth()
const loc = useLocation()
if (!isAuthed) return <Navigate to="/" state={{ from: loc }} replace />
if (roles && roles.length && !roles.includes(role)) return <Navigate to="/" replace />
return children
}