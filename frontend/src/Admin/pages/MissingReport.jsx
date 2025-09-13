// // src/pages/student/MissingReport.jsx
// import React, { useState } from 'react'
// import { api } from '../../api'
// import RequireAuth from '../../components/RequireAuth'

// function MissingReportInner() {
//   const [unit_id, setUnitId] = useState('')
//   const [description, setDescription] = useState('')
//   const [msg, setMsg] = useState('')
//   const [err, setErr] = useState('')

//   async function submit(e) {
//     e.preventDefault(); setErr(''); setMsg('')
//     try {
//       const res = await api.request('/reports/missing', {
//         method: 'POST',
//         body: { unit_id: Number(unit_id), description }
//       })
//       setMsg(`Reported #${res.id}`)
//       setUnitId(''); setDescription('')
//     } catch (e) {
//       setErr(String(e.message || e))
//     }
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Page Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-extrabold text-green-800">
//           Report Missing Mark
//         </h1>
//         <p className="mt-1 text-sm text-gray-700">
//           Submit a brief report for a unit where your mark is missing.
//         </p>
//       </div>

//       {/* Card */}
//       <div className="rounded-2xl bg-white shadow-md ring-1 ring-gray-200 overflow-hidden">
//         {/* GAU accent bar (greens) */}
//         <div className="h-1.5 bg-gradient-to-r from-green-700 via-green-700 to-green-800" />

//         <form onSubmit={submit} className="p-6 md:p-8">
//           {/* Alerts */}
//           {err && (
//             <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
//               {err}
//             </div>
//           )}
//           {msg && (
//             <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
//               {msg}
//             </div>
//           )}

//           {/* Fields */}
//           <div className="grid gap-5">
//             <div>
//               <label htmlFor="unit_id" className="block text-sm font-medium text-gray-800">
//                 Unit ID
//               </label>
//               <input
//                 id="unit_id"
//                 placeholder="e.g. 123"
//                 value={unit_id}
//                 onChange={(e) => setUnitId(e.target.value)}
//                 required
//                 className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400
//                            focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//               />
//               <p className="mt-1 text-xs text-gray-600">
//                 Enter the numeric ID of the unit (not the code).
//               </p>
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-800">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 placeholder="Briefly describe the issue (e.g., CAT or final exam missing)."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 required
//                 rows={4}
//                 className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400
//                            focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
//               />
//               <p className="mt-1 text-xs text-gray-600">
//                 Keep it short and clear. You can attach proof later if needed.
//               </p>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-6 flex items-center gap-3">
//             <button
//               type="submit"
//               className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white font-semibold
//                          bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition"
//             >
//               Send Report
//             </button>
//             <button
//               type="button"
//               onClick={() => { setUnitId(''); setDescription(''); setErr(''); setMsg(''); }}
//               className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 border border-green-700 text-green-700
//                          hover:bg-gray-100 transition"
//             >
//               Clear
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Help / Note */}
//       <div className="mt-4 text-xs text-gray-600">
//         Need the Unit ID? Check your units list or contact your lecturer/department.
//       </div>
//     </div>
//   )
// }

// export default function MissingReport() {
//   return (
//     <RequireAuth roles={['student']}>
//       <MissingReportInner />
//     </RequireAuth>
//   )
// }


// src/pages/student/MissingReport.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import RequireAuth from '../../components/RequireAuth'

function MissingReportInner() {
  const [unit_code, setUnitCode] = useState('')
  const [description, setDescription] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const [units, setUnits] = useState([])            // [{id, code, title}]
  const [loadingUnits, setLoadingUnits] = useState(true)
  const [unitsErr, setUnitsErr] = useState('')

  // fetch enrolled units to power the code list (no backend change)
  useEffect(() => {
    let alive = true
    async function getUnits() {
      setLoadingUnits(true); setUnitsErr('')
      const candidates = [
        '/student/units', '/me/units', '/units/enrolled',
        '/api/student/units', '/api/me/units'
      ]
      let found = []
      for (const path of candidates) {
        try {
          const res = await api.request(path, { method: 'GET' })
          const arr = Array.isArray(res?.data) ? res.data
                    : Array.isArray(res?.items) ? res.items
                    : Array.isArray(res) ? res : []
          if (arr.length) {
            found = arr.map(u => ({
              id: u.id ?? u.unit_id ?? u._id,
              code: (u.code ?? u.unit_code ?? '').toString(),
              title: u.title ?? u.name ?? ''
            })).filter(u => u.id != null && u.code)
            break
          }
        } catch { /* try next */ }
      }
      if (!alive) return
      setUnits(found)
      setLoadingUnits(false)
      if (!found.length) setUnitsErr('Could not load your units. You can still type the unit code manually (e.g., CHE 211).')
    }
    getUnits()
    return () => { alive = false }
  }, [])

  const codeOptions = useMemo(
    () => Array.from(new Set(units.map(u => u.code))).sort(),
    [units]
  )

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('')

    const codeTrim = (unit_code || '').trim().toUpperCase()
    if (!codeTrim) { setErr('Please enter a unit code (e.g., CHE 211).'); return }

    // 1) try resolve from enrolled list
    const match = units.find(u => (u.code || '').toUpperCase() === codeTrim)

    let unitId = match?.id
    try {
      // 2) optional backend lookup if not in enrolled cache
      if (!unitId) {
        // if you have a dedicated endpoint, it will just work; otherwise this will be ignored by catch
        const lookup = await api.request(`/units/lookup?code=${encodeURIComponent(codeTrim)}`, { method: 'GET' })
        const idFromLookup = lookup?.id ?? lookup?.data?.id ?? lookup?.unit?.id
        if (idFromLookup) unitId = Number(idFromLookup)
      }
    } catch { /* ignore, fallback to manual not-found error */ }

    if (!unitId) {
      setErr(`Unit code "${codeTrim}" was not found in your enrolled list${units.length ? '' : ' or the system'}.`)
      return
    }

    try {
      const res = await api.request('/reports/missing', {
        method: 'POST',
        body: { unit_id: Number(unitId), description }
      })
      setMsg(`Reported #${res.id}`)
      setUnitCode(''); setDescription('')
    } catch (e) {
      setErr(String(e.message || e))
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header (GAU green palette) */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-800">
          Report Missing Mark
        </h1>
        <p className="mt-1 text-sm text-gray-700">
          Enter the <span className="font-semibold">Unit Code</span> (e.g., <span className="font-mono">CHE 211</span>) and describe what’s missing.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-gray-200 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-green-700 via-green-700 to-green-800" />
        <form onSubmit={submit} className="p-6 md:p-8">
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {msg}
            </div>
          )}

          <div className="grid gap-5">
            {/* Unit Code with datalist */}
            <div>
              <label htmlFor="unit_code" className="block text-sm font-medium text-gray-800">
                Unit Code
              </label>
              <input
                id="unit_code"
                list="unit_code_list"
                placeholder="e.g., CHE 211"
                value={unit_code}
                onChange={(e) => setUnitCode(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <datalist id="unit_code_list">
                {loadingUnits ? null : codeOptions.map(code => (
                  <option key={code} value={code} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-gray-600">
                {loadingUnits
                  ? 'Loading your units…'
                  : unitsErr || 'Start typing to see your enrolled unit codes.'}
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-800">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Briefly describe the missing mark (e.g., CAT 1 not recorded)."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-600">
                Keep it short and clear. You can attach proof later if needed.
              </p>
            </div>
          </div>

 {/* Actions */}
           <div className="mt-6 flex items-center gap-3">
             <button
               type="submit"
               className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white font-semibold
                          bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition"
             >
               Send Report
             </button>
             {/* <button
               type="button"
               onClick={() => { setUnitId(''); setDescription(''); setErr(''); setMsg(''); }}
               className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 border border-green-700 text-green-700
                          hover:bg-gray-100 transition"
             >
               Clear
             </button> */}
            </div>
        </form>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        Tip: Unit code looks like <span className="font-mono">CHE 211</span>, <span className="font-mono">CSC 210</span>, etc.
      </div>
    </div>
  )
}

export default function MissingReport() {
  return (
    <RequireAuth roles={['student']}>
      <MissingReportInner />
    </RequireAuth>
  )
}


