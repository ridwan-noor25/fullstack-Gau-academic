import React, { useState } from 'react'
import { api } from '../api'
import RequireAuth from '../components/RequireAuth'


function RegisterUserInner(){
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [role, setRole] = useState('lecturer')
const [department_id, setDepartmentId] = useState('')
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function submit(e){
e.preventDefault(); setErr(''); setMsg('')
try{
const res = await api.request('/auth/register', { method:'POST', body:{ email, password, role, department_id: department_id? Number(department_id): null } })
setMsg(`Created: ${res.user.email} (${res.user.role})`)
setEmail(''); setPassword(''); setRole('lecturer'); setDepartmentId('')
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Create User (Admin)</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<form onSubmit={submit}>
<input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />{' '}
<input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />{' '}
<select value={role} onChange={e=>setRole(e.target.value)}>
<option value="lecturer">lecturer</option>
<option value="student">student</option>
<option value="hod">hod</option>
<option value="admin">admin</option>
</select>{' '}
<input placeholder="Department ID (optional)" value={department_id} onChange={e=>setDepartmentId(e.target.value)} />{' '}
<button type="submit">Create</button>
</form>
</div>
)
}


export default function RegisterUser(){
return (
<RequireAuth roles={["admin"]}>
<RegisterUserInner/>
</RequireAuth>
)
}