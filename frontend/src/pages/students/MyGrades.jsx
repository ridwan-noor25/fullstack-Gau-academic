// import React, { useEffect, useRef, useState } from "react";

// /* ========= Config (env-driven, no hardcoding) =========
//    Add these to your .env if you have matching endpoints:
//    VITE_API_BASE=http://localhost:5000
//    VITE_STUDENT_ALL_GRADES_URL=/api/student/grades
//    (Optional) VITE_STUDENT_PROFILE_URL=/api/auth/me
// */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const ALL_GRADES_URL =
//   import.meta.env.VITE_STUDENT_ALL_GRADES_URL || ""; // "" disables fetch
// const PROFILE_URL =
//   import.meta.env.VITE_STUDENT_PROFILE_URL || "/api/auth/me";

// /* ========= Helpers ========= */
// const buildUrl = (u) => (u?.startsWith("http") ? u : `${API_BASE}${u || ""}`);
// const authHeaders = () => {
//   const h = { Accept: "application/json" };
//   const tok = localStorage.getItem("token");
//   if (tok) h.Authorization = `Bearer ${tok}`;
//   return h;
// };

// // Try to resolve the student object (from localStorage or /auth/me)
// async function resolveStudent() {
//   const local = localStorage.getItem("student") || localStorage.getItem("user");
//   if (local) {
//     try { return JSON.parse(local); } catch {}
//   }
//   if (!API_BASE || !PROFILE_URL) return null;
//   try {
//     const r = await fetch(buildUrl(PROFILE_URL), {
//       headers: authHeaders(),
//       credentials: "include",
//     });
//     if (!r.ok) return null;
//     const j = await r.json();
//     return j?.user || j?.student || j || null;
//   } catch {
//     return null;
//   }
// }

// // Normalize a single grade item to { code, title, units, letter, score? }
// const normalizeGrade = (g) => {
//   if (!g || typeof g !== "object") return null;
//   const score =
//     typeof g.score === "number"
//       ? g.score
//       : Number(g.score ?? g.marks ?? g.percentage);
//   const letter = (g.letter || g.grade || "").toString().trim().toUpperCase();

//   return {
//     code: g.code || g.course_code || g.unit_code || g.course || g.unit || "—",
//     title: g.title || g.name || g.course_title || g.unit_title || "—",
//     units:
//       typeof g.units === "number"
//         ? g.units
//         : Number(g.units ?? g.credit ?? g.credit_hours) || null,
//     letter: letter || (isFinite(score) ? letterFromScore(score) : "—"),
//     score: isFinite(score) ? score : null,
//   };
// };

// // Convert numeric score to letter (tweak thresholds to match GAU)
// function letterFromScore(s) {
//   if (s >= 70) return "A";
//   if (s >= 60) return "B";
//   if (s >= 50) return "C";
//   if (s >= 40) return "D";
//   return "E";
// }

// // Compute mean letter grade from items (prefer score if available)
// function computeMeanLetter(items) {
//   const map = { A: 5, B: 4, C: 3, D: 2, E: 1 };
//   let total = 0;
//   let count = 0;
//   items.forEach((g) => {
//     if (isFinite(g.score)) {
//       // translate by score thresholds
//       total += map[letterFromScore(g.score)];
//       count++;
//     } else if (g.letter && map[g.letter] != null) {
//       total += map[g.letter];
//       count++;
//     }
//   });
//   if (!count) return "—";
//   const avg = total / count;
//   if (avg >= 4.5) return "A";
//   if (avg >= 3.5) return "B";
//   if (avg >= 2.5) return "C";
//   if (avg >= 1.5) return "D";
//   return "E";
// }

// export default function MyGrades() {
//   const [student, setStudent] = useState(null);
//   const [grades, setGrades] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const printRef = useRef(null);

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setErr("");

//       const s = await resolveStudent();
//       if (mounted) setStudent(s);

//       // fetch grades if endpoint configured
//       if (API_BASE && ALL_GRADES_URL) {
//         try {
//           const r = await fetch(buildUrl(ALL_GRADES_URL), {
//             headers: authHeaders(),
//             credentials: "include",
//           });
//           if (!r.ok) throw new Error(`HTTP ${r.status}`);
//           const j = await r.json();
//           const arr = Array.isArray(j)
//             ? j
//             : Array.isArray(j?.data)
//             ? j.data
//             : Array.isArray(j?.items)
//             ? j.items
//             : [];
//           const normalized = arr.map(normalizeGrade).filter(Boolean);
//           if (mounted) setGrades(normalized);
//         } catch (e) {
//           if (mounted) {
//             setErr("Failed to load grades.");
//             setGrades([]);
//           }
//         }
//       } else {
//         // No endpoint configured: show empty state (no hardcoding)
//         if (mounted) setGrades([]);
//       }

//       if (mounted) setLoading(false);
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const totalUnits = grades.reduce((sum, g) => sum + (g.units || 0), 0);
//   const meanLetter = computeMeanLetter(grades);

//   const handlePrint = () => {
//     // Print the whole page; the component includes print styles to hide buttons.
//     window.print();
//   };

//   return (
//     <div className="bg-white">
//       {/* Print CSS to hide buttons/etc. */}
//       <style>{`
//         @media print {
//           .no-print { display: none !important; }
//           body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
//         }
//       `}</style>

//       <div className="max-w-5xl mx-auto px-4 py-6">
//         {/* Action bar */}
//         <div className="no-print flex items-center justify-between gap-3 mb-4">
//           <h1 className="text-xl font-semibold text-gray-900">My Grades</h1>
//           <div className="flex items-center gap-2">
//             {err ? (
//               <span className="text-sm text-red-600">{err}</span>
//             ) : null}
//             <button
//               onClick={handlePrint}
//               className="inline-flex items-center rounded-md bg-green-700 px-4 py-2 text-white text-sm font-medium shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
//             >
//               Print / Save as PDF
//             </button>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading ? (
//           <div className="flex justify-center items-center h-40">
//             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700" />
//           </div>
//         ) : (
//           <div ref={printRef} className="bg-white border border-gray-300 shadow-md p-6 md:p-8">
//             {/* Header */}
//             <div className="text-center">
//               <img
//                 src="/logoo.jpg"
//                 alt="Garissa University Logo"
//                 className="h-20 mx-auto mb-4"
//               />
//               <h1 className="text-xl font-bold uppercase text-gray-800">
//                 Garissa University
//               </h1>
//               <p className="text-sm text-gray-600 -mt-1">
//                 School of Education, Arts and Social Sciences
//               </p>
//               <p className="font-semibold text-gray-700 mt-1">OFFICE OF THE DEAN</p>

//               {/* Contact Info */}
//               <div className="flex justify-between text-xs text-gray-600 mt-2">
//                 <div className="text-left">
//                   <p>
//                     <span className="font-semibold underline">Website:</span>{" "}
//                     www.gau.ac.ke
//                   </p>
//                   <p>
//                     <span className="font-semibold underline">Email:</span>{" "}
//                     deenschoolofeducation.gau@gmail.com
//                   </p>
//                   <p>
//                     <span className="font-semibold underline">Tel:</span>{" "}
//                     0724961404
//                   </p>
//                 </div>

//                 <div className="text-right">
//                   <p>P.O. BOX 1801-70100</p>
//                   <p>GARISSA,</p>
//                   <p>KENYA</p>
//                 </div>
//               </div>

//               <p className="mt-4 font-semibold text-gray-700 underline">
//                 PROVISIONAL DEGREE ACADEMIC TRANSCRIPT
//               </p>
//             </div>

//             {/* Student Info */}
//             <div className="mt-6 text-sm text-gray-700">
//               <p>
//                 <span className="font-semibold">Name:</span>{" "}
//                 {student?.name || "—"}
//               </p>
//               <p>
//                 <span className="font-semibold">Reg. No:</span>{" "}
//                 {student?.reg_number ||
//                   student?.regNumber ||
//                   student?.registration_number ||
//                   "—"}
//               </p>
//               <p>
//                 <span className="font-semibold">Degree Programme:</span>{" "}
//                 {student?.program ||
//                   student?.degree_program ||
//                   student?.course ||
//                   "—"}
//               </p>
//               {(student?.academic_year || student?.year_of_study) && (
//                 <p>
//                   <span className="font-semibold">Academic Year:</span>{" "}
//                   {student?.academic_year || "—"}{" "}
//                   <span className="font-semibold ml-6">Year of Study:</span>{" "}
//                   {student?.year_of_study || "—"}
//                 </p>
//               )}
//             </div>

//             {/* Grades Table */}
//             <div className="mt-6 overflow-x-auto">
//               <table className="w-full table-auto border border-gray-400 text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="border px-2 py-1">Course Code</th>
//                     <th className="border px-2 py-1">Descriptive Title of Course</th>
//                     <th className="border px-2 py-1">Units</th>
//                     <th className="border px-2 py-1">Grade</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {grades.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="border px-2 py-4 text-center text-gray-500">
//                         No grades available
//                       </td>
//                     </tr>
//                   ) : (
//                     grades.map((g, i) => (
//                       <tr key={i}>
//                         <td className="border px-2 py-1">{g.code}</td>
//                         <td className="border px-2 py-1">{g.title}</td>
//                         <td className="border px-2 py-1 text-center">
//                           {g.units != null ? g.units : "—"}
//                         </td>
//                         <td className="border px-2 py-1 text-center">{g.letter}</td>
//                       </tr>
//                     ))
//                   )}

//                   {/* Mean grade row */}
//                   {grades.length > 0 && (
//                     <tr className="bg-gray-50 font-semibold">
//                       <td className="border px-2 py-1 text-center" colSpan={2}>
//                         MEAN GRADE
//                       </td>
//                       <td className="border px-2 py-1 text-center" colSpan={2}>
//                         {meanLetter}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Summary */}
//             <div className="mt-6 text-sm text-gray-700">
//               <p>
//                 <span className="font-semibold">Total Number of Courses Taken:</span>{" "}
//                 {grades.length}
//               </p>
//               <p>
//                 <span className="font-semibold">Total Number of Units:</span>{" "}
//                 {totalUnits}
//               </p>
//               {/* Optional result text here if your backend provides it */}
//             </div>

//             {/* Footer Notes */}
//             <div className="mt-8 text-xs text-gray-600 border-t pt-4">
//               <div className="flex flex-col sm:flex-row justify-between">
//                 <div className="sm:w-1/2">
//                   <p className="font-semibold underline">KEY TO GRADING SYSTEM:</p>
//                   <ul className="list-disc list-inside">
//                     <li>70% – 100%: A (Excellent)</li>
//                     <li>60% – 69%: B (Good)</li>
//                     <li>50% – 59%: C (Average)</li>
//                     <li>40% – 49%: D (Pass)</li>
//                     <li>Below 40%: E (Fail)</li>
//                   </ul>
//                 </div>

//                 <div className="sm:w-1/2 sm:pl-8 mt-6 sm:mt-0">
//                   <p className="font-semibold underline">EXPLANATION OF COURSES:</p>
//                   <ul className="list-disc list-inside">
//                     <li>100–600: Undergraduate Courses</li>
//                     <li>700–900: Post-graduate Courses</li>
//                   </ul>
//                   <p className="pt-2 font-semibold">OTHER KEYS:</p>
//                   <p>* Pass after Supplementary Examination</p>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-1">
//                 <p>
//                   <span className="font-semibold">Note:</span> A Semester is a
//                   period of 16 weeks
//                 </p>
//                 <p className="pl-8">A Unit is equivalent to 1 of contact hour per week</p>
//                 <p className="pl-8">This transcript is subject to approval by Senate</p>
//               </div>

//               <div className="mt-6 text-right">
//                 <p className="text-sm font-semibold">
//                   DATE:{" "}
//                   {new Date().toLocaleDateString("en-GB", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState } from "react";

// /** ==== Config (env-driven, no hardcoding) ==== */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const MY_GRADES_URL = import.meta.env.VITE_MY_GRADES_URL || "/api/my/grades";

// /** ==== Helpers ==== */
// const buildUrl = (u) => (u?.startsWith("http") ? u : `${API_BASE}${u || ""}`);
// const authHeaders = () => {
//   const h = { Accept: "application/json" };
//   const tok = localStorage.getItem("token");
//   if (tok) h.Authorization = `Bearer ${tok}`;
//   return h;
// };

// function normalizeGrade(g) {
//   if (!g || typeof g !== "object") return null;
//   const n = (v, d = 0) => (typeof v === "number" ? v : Number(v ?? d) || d);
//   return {
//     unit:
//       g.unit ||
//       g.unit_code ||
//       g.course_code ||
//       g.course ||
//       g.code ||
//       g.name ||
//       "—",
//     assessment: g.assessment || g.assessment_type || g.type || "—",
//     weight: n(g.weight ?? g.weighting, 0),
//     max: n(g.max ?? g.max_score ?? 100, 100),
//     score: n(g.score ?? g.marks ?? g.percentage, 0),
//     status:
//       g.status ||
//       g.status_text ||
//       (typeof g.published === "boolean"
//         ? g.published
//           ? "Published"
//           : "Pending"
//         : "—"),
//   };
// }

// export default function MyGrades() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let alive = true;

//     async function run() {
//       setLoading(true);
//       setErr("");
//       try {
//         if (!API_BASE || !MY_GRADES_URL) {
//           // Graceful empty state if env not configured
//           setRows([]);
//         } else {
//           const res = await fetch(buildUrl(MY_GRADES_URL), {
//             headers: authHeaders(),
//             credentials: "include",
//           });
//           if (res.status === 401) {
//             throw new Error(
//               "Your session has expired. Please login again to view grades."
//             );
//           }
//           if (!res.ok) {
//             throw new Error(`Failed to load grades (HTTP ${res.status}).`);
//           }
//           const j = await res.json();
//           const arr = Array.isArray(j)
//             ? j
//             : Array.isArray(j?.data)
//             ? j.data
//             : Array.isArray(j?.items)
//             ? j.items
//             : Array.isArray(j?.results)
//             ? j.results
//             : [];
//           const normalized = arr.map(normalizeGrade).filter(Boolean);
//           if (alive) setRows(normalized);
//         }
//       } catch (e) {
//         if (alive) {
//           setErr(e.message || "Failed to load grades.");
//           setRows([]);
//         }
//       } finally {
//         if (alive) setLoading(false);
//       }
//     }

//     run();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const onPrint = () => window.print();

//   return (
//     <>
//       {/* Print styles to hide the toolbar when printing */}
//       <style>{`
//         @media print {
//           #grades-toolbar { display: none; }
//           .print-container { box-shadow: none !important; border: none !important; }
//           body { background: #fff; }
//         }
//       `}</style>

//       {/* Toolbar */}
//       <div
//         id="grades-toolbar"
//         className="mb-4 flex items-center justify-between gap-3"
//       >
//         <h1 className="text-xl font-semibold text-gray-900">My Grades</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={onPrint}
//             className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
//             title="Print or Save as PDF"
//           >
//             Print / Save PDF
//           </button>
//         </div>
//       </div>

//       {/* Card */}
//       <div className="print-container overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
//         {/* Loading */}
//         {loading && (
//           <div className="px-6 py-16 text-center text-gray-600">
//             Loading grades…
//           </div>
//         )}

//         {/* Error */}
//         {!loading && err && (
//           <div className="px-6 py-8">
//             <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//               {err}
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && !err && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-left">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <Th>Unit</Th>
//                   <Th>Assessment</Th>
//                   <Th>Weight</Th>
//                   <Th>Max</Th>
//                   <Th>Score</Th>
//                   <Th>Status</Th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 bg-white">
//                 {rows.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-5 py-6 text-center text-sm text-gray-500"
//                     >
//                       No grades available.
//                     </td>
//                   </tr>
//                 ) : (
//                   rows.map((r, i) => (
//                     <tr key={`${r.unit}-${r.assessment}-${i}`} className="hover:bg-gray-50">
//                       <Td className="font-medium">{r.unit}</Td>
//                       <Td>{r.assessment}</Td>
//                       <Td className="whitespace-nowrap">{r.weight}%</Td>
//                       <Td className="whitespace-nowrap">{r.max}</Td>
//                       <Td className="whitespace-nowrap">
//                         {typeof r.score === "number" ? r.score : String(r.score)}
//                       </Td>
//                       <Td>
//                         <Status s={r.status} />
//                       </Td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Subtle hint (only if API disabled) */}
//       {!loading && !err && !API_BASE && (
//         <p className="mt-3 text-xs text-gray-500">
//           Tip: set <code>VITE_API_BASE</code> and <code>VITE_MY_GRADES_URL</code> in your
//           <code>.env</code> to fetch real grades.
//         </p>
//       )}
//     </>
//   );
// }

// /** Small table helpers */
// function Th({ children }) {
//   return (
//     <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
//       {children}
//     </th>
//   );
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
// }
// function Status({ s }) {
//   const tone =
//     (s || "").toLowerCase() === "published"
//       ? "bg-emerald-50 text-emerald-800"
//       : (s || "").toLowerCase() === "pending"
//       ? "bg-amber-50 text-amber-800"
//       : "bg-gray-100 text-gray-800";
//   return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${tone}`}>{s || "—"}</span>;
// }




// src/Admin/pages/MyGrades.jsx
import React, { useEffect, useState } from "react";

/** ==== Config (env-driven, no hardcoding) ==== */
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const MY_GRADES_URL = import.meta.env.VITE_MY_GRADES_URL || "/api/my/grades";

/** ==== Helpers ==== */
const buildUrl = (u) => (u?.startsWith("http") ? u : `${API_BASE}${u || ""}`);
const authHeaders = () => {
  const h = { Accept: "application/json" };
  const tok = localStorage.getItem("token");
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
};

function normalizeGrade(g) {
  if (!g || typeof g !== "object") return null;
  const n = (v, d = 0) => (typeof v === "number" ? v : Number(v ?? d) || d);
  return {
    unit: g.unit || g.unit_code || g.course_code || g.course || g.code || g.name || "—",
    assessment: g.assessment || g.assessment_type || g.type || "—",
    weight: n(g.weight ?? g.weighting, 0),
    max: n(g.max ?? g.max_score ?? 100, 100),
    score: n(g.score ?? g.marks ?? g.percentage, 0),
    status:
      g.status ||
      g.status_text ||
      (typeof g.published === "boolean" ? (g.published ? "Published" : "Pending") : "—"),
  };
}

function MyGrades() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr("");
      try {
        if (!API_BASE || !MY_GRADES_URL) {
          setRows([]);
        } else {
          const res = await fetch(buildUrl(MY_GRADES_URL), {
            headers: authHeaders(),
            credentials: "include",
          });
          if (res.status === 401) throw new Error("Your session has expired. Please login again.");
          if (!res.ok) throw new Error(`Failed to load grades (HTTP ${res.status}).`);
          const j = await res.json();
          const arr = Array.isArray(j)
            ? j
            : Array.isArray(j?.data)
            ? j.data
            : Array.isArray(j?.items)
            ? j.items
            : Array.isArray(j?.results)
            ? j.results
            : [];
          const normalized = arr.map(normalizeGrade).filter(Boolean);
          if (alive) setRows(normalized);
        }
      } catch (e) {
        if (alive) {
          setErr(e.message || "Failed to load grades.");
          setRows([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const onPrint = () => window.print();

  return (
    <>
      <style>{`
        @media print {
          #grades-toolbar { display: none; }
          .print-container { box-shadow: none !important; border: none !important; }
          body { background: #fff; }
        }
      `}</style>

      <div id="grades-toolbar" className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">My Grades</h1>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            title="Print or Save as PDF"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="print-container overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading && <div className="px-6 py-16 text-center text-gray-600">Loading grades…</div>}

        {!loading && err && (
          <div className="px-6 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          </div>
        )}

        {!loading && !err && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Unit</Th>
                  <Th>Assessment</Th>
                  <Th>Weight</Th>
                  <Th>Max</Th>
                  <Th>Score</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-sm text-gray-500">
                      No grades available.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={`${r.unit}-${r.assessment}-${i}`} className="hover:bg-gray-50">
                      <Td className="font-medium">{r.unit}</Td>
                      <Td>{r.assessment}</Td>
                      <Td className="whitespace-nowrap">{r.weight}%</Td>
                      <Td className="whitespace-nowrap">{r.max}</Td>
                      <Td className="whitespace-nowrap">
                        {typeof r.score === "number" ? r.score : String(r.score)}
                      </Td>
                      <Td>
                        <Status s={r.status} />
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !err && !API_BASE && (
        <p className="mt-3 text-xs text-gray-500">
          Tip: set <code>VITE_API_BASE</code> and <code>VITE_MY_GRADES_URL</code> in your <code>.env</code> to fetch real grades.
        </p>
      )}
    </>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
function Status({ s }) {
  const tone =
    (s || "").toLowerCase() === "published"
      ? "bg-emerald-50 text-emerald-800"
      : (s || "").toLowerCase() === "pending"
      ? "bg-amber-50 text-amber-800"
      : "bg-gray-100 text-gray-800";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${tone}`}>{s || "—"}</span>;
}

export default MyGrades;
