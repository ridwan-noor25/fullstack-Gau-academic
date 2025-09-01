import React, { useEffect, useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function DepartmentsInner(){
const [items, setItems] = useState([])
const [name, setName] = useState('')
const [code, setCode] = useState('')
const [err, setErr] = useState('')


async function load(){
try{ const data = await api.request('/departments'); setItems(data) }catch(e){ setErr(String(e.message||e)) }
}
useEffect(()=>{ load() },[])


async function create(e){
e.preventDefault(); setErr('')
try{
const d = await api.request('/departments', { method:'POST', body:{ name, code } })
setItems(prev=>[...prev, d]); setName(''); setCode('')
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Departments</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
<form onSubmit={create} style={{marginBottom:16}}>
<input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />{' '}
<input placeholder="Code" value={code} onChange={e=>setCode(e.target.value)} required />{' '}
<button type="submit">Create</button>
</form>
<ul>
{items.map(d=> (<li key={d.id}>{d.name} ({d.code})</li>))}
</ul>
</div>
)
}


export default function Departments(){
return (
<RequireAuth roles={["admin"]}>
<DepartmentsInner/>
</RequireAuth>
)
}