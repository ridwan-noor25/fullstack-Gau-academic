import React, { useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function MissingReportInner(){
const [unit_id, setUnitId] = useState('')
const [description, setDescription] = useState('')
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function submit(e){
e.preventDefault(); setErr(''); setMsg('')
try{
const res = await api.request('/reports/missing', { method:'POST', body:{ unit_id: Number(unit_id), description } })
setMsg(`Reported #${res.id}`)
setUnitId(''); setDescription('')
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Report Missing Mark</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<form onSubmit={submit}>
<input placeholder="Unit ID" value={unit_id} onChange={e=>setUnitId(e.target.value)} required />{' '}
<input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} required />{' '}
<button type="submit">Send</button>
</form>
</div>
)
}


export default function MissingReport(){
return (
<RequireAuth roles={["student"]}>
<MissingReportInner/>
</RequireAuth>
)
}