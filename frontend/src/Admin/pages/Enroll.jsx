import React, { useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function EnrollInner(){
const [student_id, setStudentId] = useState('')
const [unit_id, setUnitId] = useState('')
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function submit(e){
e.preventDefault(); setErr(''); setMsg('')
try{
const res = await api.request('/enrollments', { method:'POST', body:{ student_id: Number(student_id), unit_id: Number(unit_id) } })
setMsg(`Enrolled student ${res.student_id} to unit ${res.unit_id}`)
setStudentId(''); setUnitId('')
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Enroll Student to Unit</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<form onSubmit={submit}>
<input placeholder="Student ID" value={student_id} onChange={e=>setStudentId(e.target.value)} required />{' '}
<input placeholder="Unit ID" value={unit_id} onChange={e=>setUnitId(e.target.value)} required />{' '}
<button type="submit">Enroll</button>
</form>
</div>
)
}


export default function Enroll(){
return (
<RequireAuth roles={["admin","hod"]}>
<EnrollInner/>
</RequireAuth>
)
}