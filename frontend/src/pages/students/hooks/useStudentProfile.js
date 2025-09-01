// // src/hooks/useStudentProfile.js
// import { useEffect, useState } from "react";

// export default function useStudentProfile() {
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
//   const PROFILE_URL = import.meta.env.VITE_STUDENT_PROFILE_URL || "/api/students/me";

//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       setLoading(true);
//       setError("");

//       try {
//         // 1) use cached student if present
//         try {
//           const cached = JSON.parse(localStorage.getItem("student") || "null");
//           if (cached) {
//             if (!cancelled) setStudent(cached);
//             // continue to fetch in background for freshness
//           }
//         } catch {}

//         // 2) fetch fresh profile
//         if (!API_BASE || !PROFILE_URL) throw new Error("Missing VITE_API_BASE or VITE_STUDENT_PROFILE_URL");

//         const token = localStorage.getItem("token");
//         const res = await fetch(`${API_BASE}${PROFILE_URL}`, {
//           method: "GET",
//           headers: {
//             Accept: "application/json",
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error(`Profile HTTP ${res.status}`);
//         const json = await res.json();

//         const s = json?.student || json?.user || json?.data || json;
//         if (s && !s.role) s.role = "student";

//         if (!cancelled) {
//           setStudent(s || null);
//           try {
//             if (s) {
//               localStorage.setItem("student", JSON.stringify(s));
//               if (s.role) localStorage.setItem("role", s.role);
//             }
//           } catch {}
//         }
//       } catch (e) {
//         if (!cancelled) setError(e.message || String(e));
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return { student, loading, error };
// }
