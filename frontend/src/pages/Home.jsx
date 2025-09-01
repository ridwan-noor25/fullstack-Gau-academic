import React from 'react'
import { useAuth } from '../auth/AuthContext'


export default function Home(){
const { role } = useAuth()
return (
<div style={{padding:16}}>
<h2>Welcome to GAU‑GradeView</h2>
<p>Role‑based dashboard. Use the navbar to access your actions.</p>
<p>Current role: <b>{role || 'Guest'}</b></p>
</div>
)
}