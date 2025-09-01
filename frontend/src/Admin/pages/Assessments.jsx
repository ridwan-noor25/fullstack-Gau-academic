import React, { useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function AssessmentsInner(){
const [unit_id, setUnitId] = useState('')
const [title, setTitle] = useState('')
const [max_score, setMax] = useState(100)
const [weight, setWeight] = useState(1)
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function submit(e){
e.preventDefault(); setErr(''); setMsg('')
try{
const res = await api.request('/assessments', { method:'POST', body:{ unit_id: Number(unit_id), title, max_score: Number(max_score), weight: Number(weight) } })
setMsg(`Created assessment ${res.title} (id ${res.id})`)
setUnitId(''); setTitle(''); setMax(100); setWeight(1)
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Create Assessment</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<form onSubmit={submit}>
<input placeholder="Unit ID" value={unit_id} onChange={e=>setUnitId(e.target.value)} required />{' '}
<input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />{' '}
<input type="number" placeholder="Max Score" value={max_score} onChange={e=>setMax(e.target.value)} />{' '}
<input type="number" step="0.1" placeholder="Weight (<=1)" value={weight} onChange={e=>setWeight(e.target.value)} />{' '}
<button type="submit">Create</button>
</form>
</div>
)
}


export default function Assessments(){
return (
<RequireAuth roles={["lecturer"]}>
<AssessmentsInner/>
</RequireAuth>
)
}