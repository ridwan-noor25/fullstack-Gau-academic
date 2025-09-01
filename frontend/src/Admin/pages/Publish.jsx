import React, { useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'


function PublishInner(){
const [unit_id, setUnitId] = useState('')
const [msg, setMsg] = useState('')
const [err, setErr] = useState('')


async function run(){
setErr(''); setMsg('')
try{
const res = await api.request(`/units/${Number(unit_id)}/publish`, { method:'POST' })
setMsg(`Published ${res.published} grades`)
}catch(e){ setErr(String(e.message||e)) }
}


return (
<div style={{padding:16}}>
<h3>Publish Unit Grades</h3>
{err && <p style={{color:'crimson'}}>{err}</p>}
{msg && <p style={{color:'green'}}>{msg}</p>}
<input placeholder="Unit ID" value={unit_id} onChange={e=>setUnitId(e.target.value)} />{' '}
<button onClick={run}>Publish</button>
</div>
)
}


export default function Publish(){
return (
<RequireAuth roles={["hod","admin"]}>
<PublishInner/>
</RequireAuth>
)
}