// import React, { useEffect, useState } from 'react'
// import { api } from '../../api'
// import RequireAuth from '../../components/RequireAuth'


// function MyGradesInner(){
// const [items, setItems] = useState([])
// const [err, setErr] = useState('')


// useEffect(()=>{
// (async()=>{
// try{ const res = await api.request('/my/grades'); setItems(res) }catch(e){ setErr(String(e.message||e)) }
// })()
// },[])


// return (
// <div style={{padding:16}}>
// <h3>My Grades</h3>
// {err && <p style={{color:'crimson'}}>{err}</p>}
// <table border="1" cellPadding="6"><thead><tr>
// <th>Unit</th><th>Assessment</th><th>Weight</th><th>Max</th><th>Score</th><th>Status</th>
// </tr></thead><tbody>
// {items.map((row, i)=> (
// <tr key={i}>
// <td>{row.unit.code} — {row.unit.title}</td>
// <td>{row.assessment.title}</td>
// <td>{row.assessment.weight}</td>
// <td>{row.assessment.max_score}</td>
// <td>{row.grade.score}</td>
// <td>{row.grade.status}</td>
// </tr>
// ))}
// </tbody></table>
// </div>
// )
// }


// export default function MyGrades(){
// return (
// <RequireAuth roles={["student"]}>
// <MyGradesInner/>
// </RequireAuth>
// )
// }




