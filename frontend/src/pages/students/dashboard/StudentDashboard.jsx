// // src/pages/students/StudentDashboard.jsx
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   AcademicCapIcon,
//   ExclamationCircleIcon,
// } from "@heroicons/react/24/outline";

// const COLOR_MAP = {
//   green: { bg: "bg-green-50", text: "text-green-700" },
//   red: { bg: "bg-red-50", text: "text-red-700" },
//   blue: { bg: "bg-blue-50", text: "text-blue-700" },
//   amber: { bg: "bg-amber-50", text: "text-amber-700" },
// };

// const StatCard = ({ title, value, icon: Icon, color = "green" }) => {
//   const { bg, text } = COLOR_MAP[color] || COLOR_MAP.green;
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <div className="flex items-center">
//         <div className={`p-3 rounded-full ${bg}`}>
//           {/* Guard against undefined Icon */}
//           {Icon && <Icon className={`w-8 h-8 ${text}`} />}
//         </div>
//         <div className="ml-4">
//           <p className="text-sm font-medium text-gray-600">{title}</p>
//           <p className="text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function StudentDashboard() {
//   const [student, setStudent] = useState(null);
//   const [summary, setSummary] = useState(null);
//   const [recentGrades, setRecentGrades] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const studentData = localStorage.getItem("student");
//     if (studentData) {
//       setStudent(JSON.parse(studentData));
//     }

//     const fetchData = async () => {
//       try {
//         const summaryData = await Promise.resolve({
//           gpa: 3.62,
//           currentUnits: 6,
//           completedUnits: 32,
//           pendingIssues: 1,
//         });

//         const gradesData = await Promise.resolve([
//           {
//             code: "CHEM 201",
//             title: "Organic Chemistry",
//             score: 86,
//             letter: "A",
//             term: "Sem 1",
//             year: 2025,
//           },
//           {
//             code: "MATH 301",
//             title: "Advanced Calculus",
//             score: 92,
//             letter: "A",
//             term: "Sem 1",
//             year: 2025,
//           },
//           {
//             code: "PHYS 101",
//             title: "Introduction to Physics",
//             score: 78,
//             letter: "B+",
//             term: "Sem 2",
//             year: 2024,
//           },
//           {
//             code: "COMP 202",
//             title: "Data Structures",
//             score: 88,
//             letter: "A-",
//             term: "Sem 2",
//             year: 2024,
//           },
//           {
//             code: "BIOL 105",
//             title: "Cell Biology",
//             score: 85,
//             letter: "A",
//             term: "Sem 1",
//             year: 2024,
//           },
//         ]);

//         setSummary(summaryData);
//         setRecentGrades(gradesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
//       </div>
//     );
//   }

//   const gpaDisplay =
//     typeof summary?.gpa === "number" ? summary.gpa.toFixed(2) : "0.00";

//   return (
//     <div>
//       {/* Welcome banner */}
    

//       {/* Quick stats grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard title="GPA" value={gpaDisplay} /> {/* no icon on purpose */}
//         <StatCard
//           title="Current Units"
//           value={summary?.currentUnits ?? "0"}
//           icon={AcademicCapIcon}
//         />
//         <StatCard
//           title="Completed Units"
//           value={summary?.completedUnits ?? "0"}
//           icon={AcademicCapIcon}
//         />
//         <StatCard
//           title="Pending Issues"
//           value={summary?.pendingIssues ?? "0"}
//           icon={ExclamationCircleIcon}
//           color="red"
//         />
//       </div>

//       {/* Recent Grades */}
//       <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-lg font-medium text-gray-900">Recent Grades</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Course
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Score
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Letter
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Term
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Year
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentGrades.length > 0 ? (
//                 recentGrades.map((grade, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {grade.code}
//                       </div>
//                       <div className="text-sm text-gray-500">{grade.title}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {grade.score}%
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {grade.letter}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {grade.term}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {grade.year}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-6 py-4 text-center text-sm text-gray-500"
//                   >
//                     No grades available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">
//         <Link
//           to="/student/grades"
//           className="inline-flex justify-center items-center px-4 py-2 bg-green-700 text-white font-medium rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//         >
//           View My Grades
//         </Link>
//         <Link
//           to="/student/report"
//           className="inline-flex justify-center items-center px-4 py-2 bg-white border border-green-700 text-green-700 font-medium rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//         >
//           Report Missing Mark
//         </Link>
//       </div>
//     </div>
//   );
// }



// src/pages/students/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AcademicCapIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

// ✅ Put these RIGHT HERE (just below imports)
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const SUMMARY_URL = import.meta.env.VITE_STUDENT_SUMMARY_URL || "";          // "" disables fetch
const RECENT_GRADES_URL = import.meta.env.VITE_STUDENT_RECENT_GRADES_URL || ""; // "" disables fetch

/* then the rest of your file: helpers, component, etc. */


// /* ========= Config (env-driven, no hardcoding) ========= */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const SUMMARY_URL =
//   import.meta.env.VITE_STUDENT_SUMMARY_URL || "/api/student/summary";
// const RECENT_GRADES_URL =
//   import.meta.env.VITE_STUDENT_RECENT_GRADES_URL || "/api/student/recent-grades";

/* ========= Helpers ========= */
const buildUrl = (u) => (u?.startsWith("http") ? u : `${API_BASE}${u || ""}`);
const authHeaders = () => {
  const h = { Accept: "application/json" };
  const tok = localStorage.getItem("token");
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
};

// Normalize backend summary to UI shape
const normalizeSummary = (raw) => {
  const s = raw?.data && typeof raw.data === "object" ? raw.data : raw || {};
  const toNum = (v) => (typeof v === "number" ? v : Number(v) || 0);
  return {
    gpa: toNum(s.gpa ?? s.GPA ?? s.cgpa),
    currentUnits: toNum(s.currentUnits ?? s.current_units ?? s.enrolled_units),
    completedUnits: toNum(s.completedUnits ?? s.completed_units),
    pendingIssues: toNum(s.pendingIssues ?? s.pending_issues ?? s.issues_open),
  };
};

// Normalize a single grade item
const normalizeGrade = (g) => {
  if (!g || typeof g !== "object") return null;
  return {
    code:
      g.code ||
      g.course_code ||
      g.unit_code ||
      g.course ||
      g.unit ||
      "—",
    title: g.title || g.name || g.course_title || g.unit_title || "—",
    score:
      typeof g.score === "number"
        ? g.score
        : Number(g.score ?? g.marks ?? g.percentage) || 0,
    letter: g.letter || g.grade || "—",
    term: g.term || g.semester || g.session || "—",
    year:
      typeof g.year === "number"
        ? g.year
        : Number(g.year ?? g.academic_year) || "—",
  };
};

// Try to resolve the student object (from localStorage or me endpoint)
async function resolveStudent() {
  const local =
    localStorage.getItem("student") || localStorage.getItem("user");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  if (!API_BASE) return null;
  try {
    const r = await fetch(buildUrl("/api/auth/me"), {
      headers: authHeaders(),
      credentials: "include",
    });
    if (!r.ok) return null;
    const j = await r.json();
    return j?.user || j || null;
  } catch {
    return null;
  }
}

const COLOR_MAP = {
  green: { bg: "bg-green-50", text: "text-green-700" },
  red: { bg: "bg-red-50", text: "text-red-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700" },
  amber: { bg: "bg-amber-50", text: "text-amber-700" },
};

const StatCard = ({ title, value, icon: Icon, color = "green" }) => {
  const { bg, text } = COLOR_MAP[color] || COLOR_MAP.green;
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bg}`}>
          {Icon && <Icon className={`w-8 h-8 ${text}`} />}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      setLoading(true);

      // 1) student identity
      const s = await resolveStudent();
      if (mounted) setStudent(s);

      // 2) summary (if endpoint configured)
      try {
        if (API_BASE && SUMMARY_URL) {
          const r = await fetch(buildUrl(SUMMARY_URL), {
            headers: authHeaders(),
            credentials: "include",
          });
          if (r.ok) {
            const j = await r.json();
            if (mounted) setSummary(normalizeSummary(j));
          } else {
            if (mounted) setSummary(null);
          }
        } else {
          if (mounted) setSummary(null);
        }
      } catch {
        if (mounted) setSummary(null);
      }

      // 3) recent grades
      try {
        if (API_BASE && RECENT_GRADES_URL) {
          const r = await fetch(buildUrl(RECENT_GRADES_URL), {
            headers: authHeaders(),
            credentials: "include",
          });
          if (r.ok) {
            const j = await r.json();
            const arr = Array.isArray(j)
              ? j
              : Array.isArray(j?.data)
              ? j.data
              : Array.isArray(j?.items)
              ? j.items
              : [];
            const normalized = arr.map(normalizeGrade).filter(Boolean).slice(0, 5);
            if (mounted) setRecentGrades(normalized);
          } else {
            if (mounted) setRecentGrades([]);
          }
        } else {
          if (mounted) setRecentGrades([]);
        }
      } catch {
        if (mounted) setRecentGrades([]);
      }

      if (mounted) setLoading(false);
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  const gpaDisplay =
    typeof summary?.gpa === "number" ? summary.gpa.toFixed(2) : "0.00";

  return (
    <div>
      {/* Quick stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="GPA" value={gpaDisplay} />
        <StatCard
          title="Current Units"
          value={summary?.currentUnits ?? "0"}
          icon={AcademicCapIcon}
        />
        <StatCard
          title="Completed Units"
          value={summary?.completedUnits ?? "0"}
          icon={AcademicCapIcon}
        />
        <StatCard
          title="Pending Issues"
          value={summary?.pendingIssues ?? "0"}
          icon={ExclamationCircleIcon}
          color="red"
        />
      </div>

      {/* Recent Grades */}
      <div className="mt-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Grades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Letter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Term
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentGrades.length > 0 ? (
                recentGrades.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {grade.code}
                      </div>
                      <div className="text-sm text-gray-500">{grade.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof grade.score === "number" ? `${grade.score}%` : grade.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.letter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.term}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.year}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No grades available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between gap-4">
        <Link
          to="/student/grades"
          className="inline-flex justify-center items-center px-4 py-2 bg-green-700 text-white font-medium rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          View My Grades
        </Link>
        <Link
          to="/student/report"
          className="inline-flex justify-center items-center px-4 py-2 bg-white border border-green-700 text-green-700 font-medium rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Report Missing Mark
        </Link>
      </div>
    </div>
  );
}
