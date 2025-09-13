// // src/pages/students/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState } from "react";
// import { getMyEnrollments, getMyGradesSafe } from "../../../utils/studentApi";

// function Stat({ label, value }) {
//   return (
//     <div className="rounded-xl border bg-white p-4 shadow-sm">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="mt-1 text-2xl font-semibold">{value}</div>
//     </div>
//   );
// }

// export default function StudentDashboard() {
//   const [enrolls, setEnrolls] = useState([]);
//   const [grades, setGrades] = useState([]);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         setErr("");
//         const [e, g] = await Promise.all([getMyEnrollments(), getMyGradesSafe()]);
//         setEnrolls(e);
//         setGrades(g);
//       } catch (e) {
//         setErr(e.message || "Failed to load.");
//       }
//     })();
//   }, []);

//   return (
//     <>
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-semibold">Welcome</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Your quick academic snapshot.
//         </p>
//       </div>

//       {err && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Stat label="Enrolled Units" value={enrolls.length} />
//         <Stat label="Published Grades" value={grades.length} />
//         <Stat label="GPA (placeholder)" value="—" />
//         <Stat label="Alerts" value="0" />
//       </div>
//     </>
//   );
// }


// // src/pages/students/dashboard/StudentDashboard.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { getMyEnrollments, getMyGradesSafe } from "../../../utils/studentApi";

// function Stat({ label, value }) {
//   return (
//     <div className="rounded-xl border bg-white p-4 shadow-sm">
//       <div className="text-sm text-gray-500">{label}</div>
//       <div className="mt-1 text-2xl font-semibold">{value}</div>
//     </div>
//   );
// }

// // --- Helpers (NEW) ---
// // Map percentage to GAU letters
// function percentToLetter(pct) {
//   if (pct == null || Number.isNaN(pct)) return "—";
//   if (pct >= 70) return "A";
//   if (pct >= 60) return "B";
//   if (pct >= 50) return "C";
//   if (pct >= 40) return "D";
//   return "Supp";
// }

// // Try to derive a per-unit % from a group item.
// // Supports shapes like:
// //   { unit, assessments:[{score,max_score}], total_score, total_pct }
// // Returns a number (0..100) or null.
// function deriveUnitPercent(group) {
//   // If the backend already computed a percentage:
//   const pre = group?.total_pct ?? group?.total_score;
//   if (typeof pre === "number") {
//     // Some backends send "total_score" as already 0..100; keep as is.
//     return pre;
//   }

//   // Otherwise, sum scores and max from assessments.
//   const arr = Array.isArray(group?.assessments) ? group.assessments : [];
//   let totalScore = 0;
//   let totalMax = 0;
//   for (const a of arr) {
//     const s = Number(a?.score);
//     const m = Number(a?.max_score);
//     if (Number.isFinite(s) && Number.isFinite(m) && m > 0) {
//       totalScore += s;
//       totalMax += m;
//     }
//   }
//   if (totalMax <= 0) return null;
//   return (totalScore / totalMax) * 100;
// }

// // Compute an overall percentage across all units by averaging unit percentages.
// // You can change the aggregation later (e.g., weight by credits) if needed.
// function computeOverallPercent(groups) {
//   const unitPcts = (Array.isArray(groups) ? groups : [])
//     .map(deriveUnitPercent)
//     .filter((v) => typeof v === "number" && Number.isFinite(v));

//   if (unitPcts.length === 0) return null;
//   const sum = unitPcts.reduce((a, b) => a + b, 0);
//   return sum / unitPcts.length;
// }

// export default function StudentDashboard() {
//   const [enrolls, setEnrolls] = useState([]);
//   const [grades, setGrades] = useState([]); // keep original shape
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     (async () => {
//       try {
//         setErr("");
//         const [e, g] = await Promise.all([getMyEnrollments(), getMyGradesSafe()]);
//         setEnrolls(e);
//         setGrades(g);
//       } catch (e) {
//         setErr(e.message || "Failed to load.");
//       }
//     })();
//   }, []);

//   // NEW: derive overall % + letter for the "Final Grade" stat
//   const overallPercent = useMemo(() => computeOverallPercent(grades), [grades]);
//   const overallLetter = useMemo(() => percentToLetter(overallPercent), [overallPercent]);
//   const finalGradeDisplay =
//     overallPercent == null ? "—" : `${overallLetter} (${overallPercent.toFixed(1)}%)`;

//   return (
//     <>
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-semibold">Welcome</h1>
//         <p className="text-sm text-gray-500 mt-1">Your quick academic snapshot.</p>
//       </div>

//       {err && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Stat label="Enrolled Units" value={enrolls.length} />
//         <Stat label="Published Grades" value={grades.length} />
//         {/* UPDATED: show Final Grade instead of GPA placeholder */}
//         <Stat label="Final Grade" value={finalGradeDisplay} />
//         {/* Alerts still placeholder (wire up later if you add notifications) */}
//         <Stat label="Alerts" value="0" />
//       </div>
//     </>
//   );
// }



// src/pages/students/dashboard/StudentDashboard.jsx
import React, { useEffect, useState /*, useMemo*/ } from "react";
import { getMyEnrollments, getMyGradesSafe } from "../../../utils/studentApi";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

/* ---------- Commented helpers for Final Grade ----------
function percentToLetter(pct) {
  if (pct == null || Number.isNaN(pct)) return "—";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "Supp";
}
function deriveUnitPercent(group) {
  const pre = group?.total_pct ?? group?.total_score;
  if (typeof pre === "number") return pre;
  const arr = Array.isArray(group?.assessments) ? group.assessments : [];
  let totalScore = 0, totalMax = 0;
  for (const a of arr) {
    const s = Number(a?.score), m = Number(a?.max_score);
    if (Number.isFinite(s) && Number.isFinite(m) && m > 0) {
      totalScore += s; totalMax += m;
    }
  }
  if (totalMax <= 0) return null;
  return (totalScore / totalMax) * 100;
}
function computeOverallPercent(groups) {
  const unitPcts = (Array.isArray(groups) ? groups : [])
    .map(deriveUnitPercent)
    .filter((v) => typeof v === "number" && Number.isFinite(v));
  if (unitPcts.length === 0) return null;
  const sum = unitPcts.reduce((a, b) => a + b, 0);
  return sum / unitPcts.length;
}
-------------------------------------------------------- */

export default function StudentDashboard() {
  const [enrolls, setEnrolls] = useState([]);
  const [grades, setGrades] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const [e, g] = await Promise.all([getMyEnrollments(), getMyGradesSafe()]);
        setEnrolls(e);
        setGrades(g);
      } catch (e) {
        setErr(e.message || "Failed to load.");
      }
    })();
  }, []);

  /* ---------- Commented Final Grade derivation ----------
  const overallPercent = useMemo(() => computeOverallPercent(grades), [grades]);
  const overallLetter = useMemo(() => percentToLetter(overallPercent), [overallPercent]);
  const finalGradeDisplay =
    overallPercent == null ? "—" : `${overallLetter} (${overallPercent.toFixed(1)}%)`;
  ------------------------------------------------------- */

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Welcome</h1>
        <p className="text-sm text-gray-500 mt-1">Your quick academic snapshot.</p>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Enrolled Units" value={enrolls.length} />
        <Stat label="Published Grades" value={grades.length} />
        {/* <Stat label="Final Grade" value={finalGradeDisplay} /> */}
        {/* <Stat label="Alerts" value="0" /> */}
      </div>
    </>
  );
}
