import React, { useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function GradesInner(){
const [assessment_id, setAssessmentId] = useState('')
const [student_id, setStudentId] = useState('')
const [score, setScore] = useState('')
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function upsert(e){
e.preventDefault(); setErr(''); setMsg('')
try{
const res = await api.request('/grades', { method:'POST', body:{ assessment_id: Number(assessment_id), student_id: Number(student_id), score: Number(score) } })
setMsg(`Saved grade ${res.id} (status ${res.status})`)
}catch(e){ setErr(String(e.message||e)) }
}


async function submitAll(){
setErr(''); setMsg('')
try{
const res = await api.request('/grades/submit', { method:'POST', body:{ assessment_id: Number(assessment_id) } })
setMsg(`Submitted ${res.updated} grades`)
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Enter Grades</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<form onSubmit={upsert}>
<input placeholder="Assessment ID" value={assessment_id} onChange={e=>setAssessmentId(e.target.value)} required />{' '}
<input placeholder="Student ID" value={student_id} onChange={e=>setStudentId(e.target.value)} required />{' '}
<input type="number" placeholder="Score" value={score} onChange={e=>setScore(e.target.value)} required />{' '}
<button type="submit">Save</button>
</form>
<button style={{marginTop:12}} onClick={submitAll}>Submit All for Assessment</button>
</div>
)
}


export default function Grades(){
return (
<RequireAuth roles={["lecturer"]}>
<GradesInner/>
</RequireAuth>
)
}