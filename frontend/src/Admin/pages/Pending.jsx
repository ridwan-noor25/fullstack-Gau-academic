import React, { useEffect, useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function PendingInner(){
const [rows, setRows] = useState([])
const [err, setErr] = useState('')
const [msg, setMsg] = useState('')


async function load(){
try{ const data = await api.request('/grades/pending'); setRows(data) }catch(e){ setErr(String(e.message||e)) }
}
useEffect(()=>{ load() },[])


async function approve(id){
setErr(''); setMsg('')
try{ const g = await api.request(`/grades/${id}/approve`, { method:'POST' }); setMsg(`Approved grade ${g.id}`); load() }catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Pending Grades</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<table border="1" cellPadding="6"><thead><tr><th>ID</th><th>Assessment</th><th>Student</th><th>Score</th><th>Status</th><th/></tr></thead>
<tbody>
{rows.map(r => (
<tr key={r.id}>
<td>{r.id}</td><td>{r.assessment_id}</td><td>{r.student_id}</td><td>{r.score}</td><td>{r.status}</td>
<td><button onClick={()=>approve(r.id)}>Approve</button></td>
</tr>
))}
</tbody></table>
</div>
)
}


export default function Pending(){
return (
<RequireAuth roles={["hod"]}>
<PendingInner/>
</RequireAuth>
)
}