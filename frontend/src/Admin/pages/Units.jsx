import React, { useEffect, useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function UnitsInner(){
const [units, setUnits] = useState([])
const [code, setCode] = useState('')
const [title, setTitle] = useState('')
const [department_id, setDepartmentId] = useState('')
const [credits, setCredits] = useState(3)
const [err, setErr] = useState('')


async function load(){
try{
// no /units list endpoint in backend; fetch departments to show IDs
const deps = await api.request('/departments');
console.log('Departments for ref:', deps)
}catch(e){ setErr(String(e.message||e)) }
}
useEffect(()=>{ load() },[])


async function create(e){
e.preventDefault(); setErr('')
try{
const u = await api.request('/units', { method:'POST', body:{ code, title, credits: Number(credits), department_id: Number(department_id) } })
setUnits(prev=>[...prev, u]); setCode(''); setTitle(''); setDepartmentId(''); setCredits(3)
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Create Unit</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
<form onSubmit={create}>
<input placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} required />{' '}
<input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />{' '}
<input type="number" placeholder="Credits" value={credits} onChange={e=>setCredits(e.target.value)} />{' '}
<input placeholder="Department ID" value={department_id} onChange={e=>setDepartmentId(e.target.value)} required />{' '}
<button type="submit">Create</button>
</form>
<ul>
{units.map(u => (<li key={u.id}>{u.code} - {u.title} (dept {u.department_id})</li>))}
</ul>
</div>
)
}


export default function Units(){
return (
<RequireAuth roles={["admin","hod"]}>
<UnitsInner/>
</RequireAuth>
)
}