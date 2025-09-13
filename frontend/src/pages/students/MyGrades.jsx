// // src/pages/students/MyGrades.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { studentListPublishedGrades } from "../../utils/studentApi";

// export default function MyGrades() {
//   const [groups, setGroups] = useState([]); // [{ unit, assessments: [...] }]
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let on = true;
//     async function load() {
//       setLoading(true);
//       setErr("");
//       try {
//         const items = await studentListPublishedGrades();
//         if (!on) return;
//         setGroups(items);
//       } catch (e) {
//         if (on) setErr(e.message || "Failed to fetch grades.");
//       } finally {
//         if (on) setLoading(false);
//       }
//     }
//     load();
//     return () => { on = false; };
//   }, []);

//   return (
//     <div className="space-y-6">
//       <header>
//         <h1 className="text-2xl font-semibold text-gray-900">My Grades</h1>
//         <p className="text-sm text-gray-600">Published assessments only.</p>
//       </header>

//       {err && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
//         </div>
//       ) : groups.length === 0 ? (
//         <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
//           No published grades yet.
//         </div>
//       ) : (
//         groups.map(({ unit, assessments }) => (
//           <section key={unit?.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
//             <div className="border-b bg-gray-50 px-4 py-3">
//               <div className="font-semibold text-gray-900">
//                 {unit?.code} — {unit?.title}
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full text-left text-sm">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <Th>Assessment</Th>
//                     <Th>Score (%)</Th>
//                     <Th>Max</Th>
                    
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {(!assessments || assessments.length === 0) ? (
//                     <tr>
//                       <td colSpan={5} className="px-4 py-5 text-gray-500 text-center">
//                         No published assessments in this unit yet.
//                       </td>
//                     </tr>
//                   ) : (
//                     assessments.map((a) => {
//                       const pct = a.score != null && a.max_score ? ((a.score / a.max_score) * 100) : null;
//                       return (
//                         <tr key={a.id}>
//                           <Td className="font-medium">{a.title}</Td>
//                           <Td>{a.weight ?? "—"}</Td>
//                           <Td>{a.max_score ?? "—"}</Td>
                       
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Optional per-unit summary */}
//             <UnitSummary assessments={assessments} />
//           </section>
//         ))
//       )}
//     </div>
//   );
// }

// function UnitSummary({ assessments = [] }) {
//   const summary = useMemo(() => {
//     if (!assessments.length) return null;

//     let totalWeight = 0;
//     let weightedPct = 0;

//     assessments.forEach((a) => {
//       const w = Number(a.weight || 0);
//       const pct = (a.score != null && a.max_score) ? (a.score / a.max_score) * 100 : null;
//       totalWeight += w;
//       if (pct != null) {
//         weightedPct += (pct * w);
//       }
//     });

//     const overall = totalWeight > 0 ? (weightedPct / totalWeight) : null;
//     return { totalWeight, overall };
//   }, [assessments]);

//   if (!summary) return null;

//   return (
//     <div className="border-t bg-gray-50 px-4 py-3 text-sm flex items-center gap-6">
//       <div className="text-gray-700">
//         <span className="font-medium">Total Weight:</span> {summary.totalWeight}
//       </div>
//       <div className="text-gray-700">
//         <span className="font-medium">Weighted %:</span>{" "}
//         {summary.overall != null ? summary.overall.toFixed(1) : "—"}
//       </div>
//     </div>
//   );
// }

// function Th({ children }) {
//   return (
//     <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
//       {children}
//     </th>
//   );
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-4 py-2 ${className}`}>{children}</td>;
// }


// // src/pages/students/MyGrades.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { studentListPublishedGrades } from "../../utils/studentApi";

// export default function MyGrades() {
//   const [groups, setGroups] = useState([]); // [{ unit, assessments: [...] }]
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let on = true;
//     async function load() {
//       setLoading(true);
//       setErr("");
//       try {
//         const items = await studentListPublishedGrades();
//         if (!on) return;
//         setGroups(items);
//       } catch (e) {
//         if (on) setErr(e.message || "Failed to fetch grades.");
//       } finally {
//         if (on) setLoading(false);
//       }
//     }
//     load();
//     return () => {
//       on = false;
//     };
//   }, []);

//   function getLetterGrade(pct) {
//     if (pct == null) return "—";
//     if (pct >= 70) return "A";
//     if (pct >= 60) return "B";
//     if (pct >= 50) return "C";
//     if (pct >= 40) return "D";
//     return "Supp";
//   }

//   return (
//     <div className="space-y-6">
//       <header>
//         <h1 className="text-2xl font-semibold text-gray-900">My Grades</h1>
//         <p className="text-sm text-gray-600">Published assessments only.</p>
//       </header>

//       {err && (
//         <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
//         </div>
//       ) : groups.length === 0 ? (
//         <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
//           No published grades yet.
//         </div>
//       ) : (
//         groups.map(({ unit, assessments }) => {
//           // compute total score and max for this unit
//           let totalScore = 0;
//           let totalMax = 0;
//           assessments.forEach((a) => {
//             if (a.score != null && a.max_score) {
//               totalScore += a.score;
//               totalMax += a.max_score;
//             }
//           });
//           const pct = totalMax > 0 ? (totalScore / totalMax) * 100 : null;
//           const letter = getLetterGrade(pct);

//           return (
//             <section
//               key={unit?.id}
//               className="rounded-xl border bg-white shadow-sm overflow-hidden"
//             >
//               <div className="border-b bg-gray-50 px-4 py-3 flex justify-between items-center">
//                 <div className="font-semibold text-gray-900">
//                   {unit?.code} — {unit?.title}
//                 </div>
//                 <div className="text-sm font-medium text-green-700">
//                   Final Grade: {letter}{" "}
//                   {pct != null ? `(${pct.toFixed(1)}%)` : ""}
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <Th>Assessment</Th>
//                       <Th>Score</Th>
//                       <Th>Max</Th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y">
//                     {!assessments || assessments.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={3}
//                           className="px-4 py-5 text-gray-500 text-center"
//                         >
//                           No published assessments in this unit yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       assessments.map((a) => (
//                         <tr key={a.id}>
//                           <Td className="font-medium">{a.title}</Td>
//                           <Td>
//                             {a.score != null ? a.score : "—"}
//                           </Td>
//                           <Td>{a.max_score ?? "—"}</Td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           );
//         })
//       )}
//     </div>
//   );
// }

// function Th({ children }) {
//   return (
//     <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
//       {children}
//     </th>
//   );
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-4 py-2 ${className}`}>{children}</td>;
// }



// src/pages/students/MyGrades.jsx
import React, { useEffect, useState } from "react";
import { studentListPublishedGrades } from "../../utils/studentApi";

export default function MyGrades() {
  const [groups, setGroups] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setErr("");
        setLoading(true);
        const items = await studentListPublishedGrades();
        if (on) setGroups(items);
      } catch (e) {
        if (on) setErr(e.message || "Failed to fetch grades.");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  function getLetterGrade(pct) {
    if (pct == null) return "—";
    if (pct >= 70) return "A";
    if (pct >= 60) return "B";
    if (pct >= 50) return "C";
    if (pct >= 40) return "D";
    return "Supp";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">My Grades</h1>
        <p className="text-sm text-gray-600">Published assessments only.</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
          No published grades yet.
        </div>
      ) : (
        groups.map(({ unit, assessments }) => {
          // sum raw points
          let totalScore = 0;
          let totalMax = 0;
          assessments?.forEach((a) => {
            if (a?.score != null && a?.max_score != null) {
              totalScore += Number(a.score);
              totalMax += Number(a.max_score);
            }
          });
          const pct = totalMax > 0 ? (totalScore / totalMax) * 100 : null;
          const letter = getLetterGrade(pct);

          return (
            <section key={unit?.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="border-b bg-gray-50 px-4 py-3 flex justify-between items-center">
                <div className="font-semibold text-gray-900">
                  {unit?.code} — {unit?.title}
                </div>
                <div className="text-sm font-medium text-green-700">
                  Final Grade: {letter}{pct != null ? ` (${pct.toFixed(1)}%)` : ""}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>Assessment</Th>
                      <Th>Score</Th>
                      <Th>Max</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {!assessments || assessments.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-5 text-gray-500 text-center">
                          No published assessments in this unit yet.
                        </td>
                      </tr>
                    ) : (
                      assessments.map((a) => (
                        <tr key={a.id}>
                          <Td className="font-medium">{a.title}</Td>
                          <Td>{a.score != null ? a.score : "—"}</Td>
                          <Td>{a.max_score != null ? a.max_score : "—"}</Td>
                        </tr>
                      ))
                    )}
                    {/* TOTAL row: show overall percent only (no separate % column) */}
                    <tr className="bg-gray-50 font-medium">
                      <Td>Total (CAT + Exam)</Td>
                      <Td colSpan={2}>
                        {pct != null ? `${pct.toFixed(1)}%` : "—"}
                      </Td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>;
}
