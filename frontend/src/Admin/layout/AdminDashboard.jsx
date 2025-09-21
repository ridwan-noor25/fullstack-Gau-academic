// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ArrowPathIcon,
//   UsersIcon,
//   BuildingOfficeIcon,
//   BookOpenIcon,
//   ClipboardDocumentCheckIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";

// /** Env-based endpoints (unchanged behavior) */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const ADMIN_SUMMARY_URL = import.meta.env.VITE_ADMIN_SUMMARY_URL || "";   // e.g. /api/admin/summary
// const ADMIN_RECENT_URL = import.meta.env.VITE_ADMIN_RECENT_URL || "";     // e.g. /api/admin/recent-activity

// const buildUrl = (u) => (u && u.startsWith("http") ? u : `${API_BASE}${u || ""}`);
// const authHeaders = () => {
//   const h = { Accept: "application/json" };
//   const token = localStorage.getItem("token");
//   if (token) h.Authorization = `Bearer ${token}`;
//   return h;
// };

// const StatCard = ({ label, value, Icon, tone = "green", hint }) => {
//   const tones = {
//     green: { ring: "ring-green-200", icon: "text-green-700" },
//     blue: { ring: "ring-blue-200", icon: "text-blue-700" },
//     amber: { ring: "ring-amber-200", icon: "text-amber-700" },
//     red: { ring: "ring-red-200", icon: "text-red-700" },
//     gray: { ring: "ring-gray-200", icon: "text-gray-700" },
//   }[tone] || {};
//   return (
//     <div className={`bg-white rounded-2xl shadow-sm ring-1 ${tones.ring} p-5`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500">{label}</p>
//           <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
//           {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
//         </div>
//         {Icon ? <Icon className={`h-8 w-8 ${tones.icon}`} /> : null}
//       </div>
//     </div>
//   );
// };

// const Pill = ({ children, tone = "gray" }) => {
//   const tones = {
//     green: "bg-green-50 text-green-800",
//     amber: "bg-amber-50 text-amber-800",
//     red: "bg-red-50 text-red-800",
//     gray: "bg-gray-100 text-gray-800",
//     blue: "bg-blue-50 text-blue-800",
//   }[tone];
//   return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones}`}>{children}</span>;
// };

// const toNum = (v, d = 0) => (typeof v === "number" ? v : v != null ? Number(v) || d : d);

// function normalizeSummary(raw) {
//   const r = raw?.data && typeof raw.data === "object" ? raw.data : raw || {};
//   return {
//     totalUsers: toNum(r.totalUsers ?? r.total_users),
//     students: toNum(r.students ?? r.student_count),
//     lecturers: toNum(r.lecturers ?? r.lecturer_count),
//     hods: toNum(r.hods ?? r.hod_count),
//     departments: toNum(r.departments ?? r.department_count),
//     units: toNum(r.units ?? r.unit_count),
//     pendingApprovals: toNum(r.pendingApprovals ?? r.pending_approvals ?? r.pending_grades ?? r.pending_reports),
//     openReports: toNum(r.openReports ?? r.open_reports ?? r.reports_open),
//   };
// }

// function normalizeRecent(raw) {
//   const arr =
//     Array.isArray(raw) ? raw :
//     Array.isArray(raw?.data) ? raw.data :
//     Array.isArray(raw?.items) ? raw.items :
//     Array.isArray(raw?.results) ? raw.results : [];
//   return arr.slice(0, 10).map((x) => ({
//     id: x.id ?? x._id ?? x.uid ?? "",
//     kind: x.kind ?? x.type ?? "activity",
//     title: x.title ?? x.message ?? x.action ?? "—",
//     actor: x.actor ?? x.user ?? x.performed_by ?? "System",
//     at: x.at ?? x.created_at ?? x.timestamp ?? new Date().toISOString(),
//     meta: x.meta ?? {},
//   }));
// }

// function AdminDashboardInner() {
//   const [summary, setSummary] = useState(null);
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   const canCallSummary = Boolean(API_BASE && ADMIN_SUMMARY_URL);
//   const canCallRecent = Boolean(API_BASE && ADMIN_RECENT_URL);

//   async function fetchData() {
//     setLoading(true);
//     setErr("");
//     try {
//       const [sum, rec] = await Promise.all([
//         canCallSummary
//           ? fetch(buildUrl(ADMIN_SUMMARY_URL), { headers: authHeaders(), credentials: "include" })
//               .then(async (r) => {
//                 if (!r.ok) throw new Error(`Summary HTTP ${r.status}`);
//                 return normalizeSummary(await r.json());
//               })
//           : Promise.resolve(null),
//         canCallRecent
//           ? fetch(buildUrl(ADMIN_RECENT_URL), { headers: authHeaders(), credentials: "include" })
//               .then(async (r) => {
//                 if (!r.ok) throw new Error(`Recent HTTP ${r.status}`);
//                 return normalizeRecent(await r.json());
//               })
//           : Promise.resolve([]),
//       ]);
//       setSummary(sum);
//       setRecent(rec);
//     } catch (e) {
//       setErr(e.message || "Failed to load admin dashboard.");
//       setSummary(null);
//       setRecent([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//     const onFocus = () => fetchData();
//     window.addEventListener("focus", onFocus);
//     return () => window.removeEventListener("focus", onFocus);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const stats = useMemo(
//     () => ({
//       totalUsers: summary?.totalUsers ?? 0,
//       students: summary?.students ?? 0,
//       lecturers: summary?.lecturers ?? 0,
//       hods: summary?.hods ?? 0,
//       departments: summary?.departments ?? 0,
//       units: summary?.units ?? 0,
//       pendingApprovals: summary?.pendingApprovals ?? 0,
//       openReports: summary?.openReports ?? 0,
//     }),
//     [summary]
//   );

//   return (
//     <div>
//       {/* Top row */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">Admin Dashboard</h1>
//           <p className="text-sm text-gray-600">Manage departments, users, units, and system health at a glance.</p>
//           {err && (
//             <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {err}
//             </div>
//           )}
//         </div>
//         <button
//           onClick={fetchData}
//           className="inline-flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-sm hover:bg-gray-50"
//           title="Refresh"
//         >
//           <ArrowPathIcon className="h-5 w-5" />
//           Refresh
//         </button>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
//         </div>
//       ) : (
//         <>
//           {/* KPIs */}
//           <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             <StatCard label="Total Users" value={stats.totalUsers} Icon={UsersIcon} tone="blue" />
//             <StatCard label="Students" value={stats.students} Icon={UsersIcon} tone="green" />
//             <StatCard label="Lecturers" value={stats.lecturers} Icon={UsersIcon} tone="green" />
//             <StatCard label="HoDs" value={stats.hods} Icon={UsersIcon} tone="green" />
//             <StatCard label="Departments" value={stats.departments} Icon={BuildingOfficeIcon} tone="gray" />
//             <StatCard label="Units" value={stats.units} Icon={BookOpenIcon} tone="gray" />
//             <StatCard label="Pending Approvals" value={stats.pendingApprovals} Icon={ExclamationTriangleIcon} tone="amber" />
//             <StatCard label="Open Reports" value={stats.openReports} Icon={ClipboardDocumentCheckIcon} tone="red" />
//           </div>

//           {/* Recent + Snapshot */}
//           <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
//             {/* Recent Activity */}
//             <section className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
//                 {Boolean(ADMIN_RECENT_URL) && (
//                   <span className="text-xs text-gray-500">Last {Math.min(10, recent.length)} events</span>
//                 )}
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <Th>Type</Th>
//                       <Th>Title</Th>
//                       <Th>Actor</Th>
//                       <Th>When</Th>
//                       <Th>Info</Th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {recent.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="px-5 py-6 text-center text-gray-500">
//                           No activity yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       recent.map((r) => (
//                         <tr key={r.id} className="hover:bg-gray-50">
//                           <Td>
//                             <span className="inline-flex items-center gap-1">
//                               {r.kind === "success" && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
//                               <Pill tone={r.kind === "error" ? "red" : r.kind === "warn" ? "amber" : "blue"}>
//                                 {String(r.kind).toUpperCase()}
//                               </Pill>
//                             </span>
//                           </Td>
//                           <Td className="font-medium">{r.title}</Td>
//                           <Td>{r.actor}</Td>
//                           <Td className="whitespace-nowrap">{new Date(r.at).toLocaleString()}</Td>
//                           <Td className="text-xs text-gray-600">
//                             {r.meta?.unit ? `Unit: ${r.meta.unit}` : r.meta?.department ? `Dept: ${r.meta.department}` : "—"}
//                           </Td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             {/* System Snapshot */}
//             <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-900">System Snapshot</h2>
//                 <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <div className="mt-4 space-y-3">
//                 <Row label="Users"><Pill tone="blue">{stats.totalUsers}</Pill></Row>
//                 <Row label="Students"><Pill tone="green">{stats.students}</Pill></Row>
//                 <Row label="Lecturers"><Pill tone="green">{stats.lecturers}</Pill></Row>
//                 <Row label="HoDs"><Pill tone="green">{stats.hods}</Pill></Row>
//                 <Row label="Departments"><Pill tone="gray">{stats.departments}</Pill></Row>
//                 <Row label="Units"><Pill tone="gray">{stats.units}</Pill></Row>
//                 <Row label="Pending Approvals"><Pill tone="amber">{stats.pendingApprovals}</Pill></Row>
//                 <Row label="Open Reports"><Pill tone="red">{stats.openReports}</Pill></Row>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function Row({ label, children }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-sm text-gray-600">{label}</span>
//       {children}
//     </div>
//   );
// }
// function Th({ children }) {
//   return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
// }

// export default function AdminDashboard() {
//   return <AdminDashboardInner />;
// }



// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ArrowPathIcon,
//   UsersIcon,
//   BuildingOfficeIcon,
//   BookOpenIcon,
//   ClipboardDocumentCheckIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";

// /** Env-based endpoints (unchanged behavior) */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const ADMIN_SUMMARY_URL = import.meta.env.VITE_ADMIN_SUMMARY_URL || "";   // e.g. /api/admin/summary or full URL
// const ADMIN_RECENT_URL = import.meta.env.VITE_ADMIN_RECENT_URL || "";     // e.g. /api/admin/recent-activity

// const buildUrl = (u) => (u && u.startsWith("http") ? u : `${API_BASE}${u || ""}`);
// const authHeaders = () => {
//   const h = { Accept: "application/json" };
//   const token = localStorage.getItem("token");
//   if (token) h.Authorization = `Bearer ${token}`;
//   return h;
// };

// const StatCard = ({ label, value, Icon, tone = "green", hint }) => {
//   const tones = {
//     green: { ring: "ring-green-200", icon: "text-green-700" },
//     blue: { ring: "ring-blue-200", icon: "text-blue-700" },
//     amber: { ring: "ring-amber-200", icon: "text-amber-700" },
//     red: { ring: "ring-red-200", icon: "text-red-700" },
//     gray: { ring: "ring-gray-200", icon: "text-gray-700" },
//   }[tone] || {};
//   return (
//     <div className={`bg-white rounded-2xl shadow-sm ring-1 ${tones.ring} p-5`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500">{label}</p>
//           <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
//           {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
//         </div>
//         {Icon ? <Icon className={`h-8 w-8 ${tones.icon}`} /> : null}
//       </div>
//     </div>
//   );
// };

// const Pill = ({ children, tone = "gray" }) => {
//   const tones = {
//     green: "bg-green-50 text-green-800",
//     amber: "bg-amber-50 text-amber-800",
//     red: "bg-red-50 text-red-800",
//     gray: "bg-gray-100 text-gray-800",
//     blue: "bg-blue-50 text-blue-800",
//   }[tone];
//   return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones}`}>{children}</span>;
// };

// const toNum = (v, d = 0) => (typeof v === "number" ? v : v != null ? Number(v) || d : d);

// function normalizeSummary(raw) {
//   const r = raw?.data && typeof raw.data === "object" ? raw.data : raw || {};
//   return {
//     totalUsers: toNum(r.totalUsers ?? r.total_users),
//     students: toNum(r.students ?? r.student_count),
//     lecturers: toNum(r.lecturers ?? r.lecturer_count),
//     hods: toNum(r.hods ?? r.hod_count),
//     departments: toNum(r.departments ?? r.department_count),
//     units: toNum(r.units ?? r.unit_count),
//     pendingApprovals: toNum(r.pendingApprovals ?? r.pending_approvals ?? r.pending_grades ?? r.pending_reports),
//     openReports: toNum(r.openReports ?? r.open_reports ?? r.reports_open),
//   };
// }

// function normalizeRecent(raw) {
//   const arr =
//     Array.isArray(raw) ? raw :
//     Array.isArray(raw?.data) ? raw.data :
//     Array.isArray(raw?.items) ? raw.items :
//     Array.isArray(raw?.results) ? raw.results : [];
//   return arr.slice(0, 10).map((x) => ({
//     id: x.id ?? x._id ?? x.uid ?? "",
//     kind: x.kind ?? x.type ?? "activity",
//     title: x.title ?? x.message ?? x.action ?? "—",
//     actor: x.actor ?? x.user ?? x.performed_by ?? "System",
//     at: x.at ?? x.created_at ?? x.timestamp ?? new Date().toISOString(),
//     meta: x.meta ?? {},
//   }));
// }

// function AdminDashboardInner() {
//   const [summary, setSummary] = useState(null);
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // ✅ Allow calls even when API_BASE is blank (absolute endpoints work)
//   const canCallSummary = Boolean(ADMIN_SUMMARY_URL);
//   const canCallRecent = Boolean(ADMIN_RECENT_URL);

//   async function fetchData() {
//     setLoading(true);
//     setErr("");
//     try {
//       const [sum, rec] = await Promise.all([
//         canCallSummary
//           ? fetch(buildUrl(ADMIN_SUMMARY_URL), { headers: authHeaders(), credentials: "include" })
//               .then(async (r) => {
//                 if (!r.ok) throw new Error(`Summary HTTP ${r.status}`);
//                 return normalizeSummary(await r.json());
//               })
//           : Promise.resolve(null),
//         canCallRecent
//           ? fetch(buildUrl(ADMIN_RECENT_URL), { headers: authHeaders(), credentials: "include" })
//               .then(async (r) => {
//                 if (!r.ok) throw new Error(`Recent HTTP ${r.status}`);
//                 return normalizeRecent(await r.json());
//               })
//           : Promise.resolve([]),
//       ]);
//       setSummary(sum);
//       setRecent(rec);
//     } catch (e) {
//       setErr(e.message || "Failed to load admin dashboard.");
//       setSummary(null);
//       setRecent([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//     const onFocus = () => fetchData();
//     window.addEventListener("focus", onFocus);
//     return () => window.removeEventListener("focus", onFocus);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const stats = useMemo(
//     () => ({
//       totalUsers: summary?.totalUsers ?? 0,
//       students: summary?.students ?? 0,
//       lecturers: summary?.lecturers ?? 0,
//       hods: summary?.hods ?? 0,
//       departments: summary?.departments ?? 0,
//       units: summary?.units ?? 0,
//       pendingApprovals: summary?.pendingApprovals ?? 0,
//       openReports: summary?.openReports ?? 0,
//     }),
//     [summary]
//   );

//   return (
//     <div>
//       {/* Top row */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           {/* <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">Admin Dashboard</h1> */}
//           <p className="text-sm text-gray-600">Manage departments, users, units, and system health at a glance.</p>
//           {err && (
//             <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//               {err}
//             </div>
//           )}
//         </div>
//         {/* <button
//           onClick={fetchData}
//           className="inline-flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-sm hover:bg-gray-50"
//           title="Refresh"
//         >
//           <ArrowPathIcon className="h-5 w-5" />
//           Refresh
//         </button> */}
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
//         </div>
//       ) : (
//         <>
//           {/* KPIs */}
//           <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             <StatCard label="Total Users" value={stats.totalUsers} Icon={UsersIcon} tone="blue" />
//             <StatCard label="Students" value={stats.students} Icon={UsersIcon} tone="green" />
//             <StatCard label="Lecturers" value={stats.lecturers} Icon={UsersIcon} tone="green" />
//             <StatCard label="HoDs" value={stats.hods} Icon={UsersIcon} tone="green" />
//             <StatCard label="Departments" value={stats.departments} Icon={BuildingOfficeIcon} tone="gray" />
//             <StatCard label="Units" value={stats.units} Icon={BookOpenIcon} tone="gray" />
//             <StatCard label="Pending Approvals" value={stats.pendingApprovals} Icon={ExclamationTriangleIcon} tone="amber" />
//             <StatCard label="Open Reports" value={stats.openReports} Icon={ClipboardDocumentCheckIcon} tone="red" />
//           </div>

//           {/* Recent + Snapshot */}
//           <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
//             {/* Recent Activity */}
//             <section className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
//                 {Boolean(ADMIN_RECENT_URL) && (
//                   <span className="text-xs text-gray-500">Last {Math.min(10, recent.length)} events</span>
//                 )}
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <Th>Type</Th>
//                       <Th>Title</Th>
//                       <Th>Actor</Th>
//                       <Th>When</Th>
//                       <Th>Info</Th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {recent.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="px-5 py-6 text-center text-gray-500">
//                           No activity yet.
//                         </td>
//                       </tr>
//                     ) : (
//                       recent.map((r) => (
//                         <tr key={r.id} className="hover:bg-gray-50">
//                           <Td>
//                             <span className="inline-flex items-center gap-1">
//                               {r.kind === "success" && <CheckCircleIcon className="h-4 w-4 text-green-600" />}
//                               <Pill tone={r.kind === "error" ? "red" : r.kind === "warn" ? "amber" : "blue"}>
//                                 {String(r.kind).toUpperCase()}
//                               </Pill>
//                             </span>
//                           </Td>
//                           <Td className="font-medium">{r.title}</Td>
//                           <Td>{r.actor}</Td>
//                           <Td className="whitespace-nowrap">{new Date(r.at).toLocaleString()}</Td>
//                           <Td className="text-xs text-gray-600">
//                             {r.meta?.unit ? `Unit: ${r.meta.unit}` : r.meta?.department ? `Dept: ${r.meta.department}` : "—"}
//                           </Td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             {/* System Snapshot */}
//             <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-900">System Snapshot</h2>
//                 <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <div className="mt-4 space-y-3">
//                 <Row label="Users"><Pill tone="blue">{stats.totalUsers}</Pill></Row>
//                 <Row label="Students"><Pill tone="green">{stats.students}</Pill></Row>
//                 <Row label="Lecturers"><Pill tone="green">{stats.lecturers}</Pill></Row>
//                 <Row label="HoDs"><Pill tone="green">{stats.hods}</Pill></Row>
//                 <Row label="Departments"><Pill tone="gray">{stats.departments}</Pill></Row>
//                 <Row label="Units"><Pill tone="gray">{stats.units}</Pill></Row>
//                 <Row label="Pending Approvals"><Pill tone="amber">{stats.pendingApprovals}</Pill></Row>
//                 <Row label="Open Reports"><Pill tone="red">{stats.openReports}</Pill></Row>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function Row({ label, children }) {
//   return (
//     <div className="flex items-center justify-between">
//       <span className="text-sm text-gray-600">{label}</span>
//       {children}
//     </div>
//   );
// }
// function Th({ children }) {
//   return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
// }

// export default function AdminDashboard() {
//   return <AdminDashboardInner />;
// }



// import React, { useEffect, useMemo, useState } from "react";
// import {
//   UsersIcon,
//   BuildingOfficeIcon,
//   BookOpenIcon,
//   ClipboardDocumentCheckIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   Cog6ToothIcon,
// } from "@heroicons/react/24/outline";

// /** Env-based endpoints */
// const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
// const ADMIN_SUMMARY_URL = import.meta.env.VITE_ADMIN_SUMMARY_URL || "/api/admin/summary";
// const ADMIN_RECENT_URL = import.meta.env.VITE_ADMIN_RECENT_URL || "/api/admin/recent-activity";

// const buildUrl = (u) => (u && u.startsWith("http") ? u : `${API_BASE}${u || ""}`);
// const authHeaders = () => {
//   const h = { Accept: "application/json" };
//   const token = localStorage.getItem("token");
//   if (token) h.Authorization = `Bearer ${token}`;
//   return h;
// };

// const StatCard = ({ label, value, Icon, tone = "green" }) => {
//   const tones = {
//     green: { ring: "ring-green-200", icon: "text-green-700" },
//     blue: { ring: "ring-blue-200", icon: "text-blue-700" },
//     amber: { ring: "ring-amber-200", icon: "text-amber-700" },
//     red: { ring: "ring-red-200", icon: "text-red-700" },
//     gray: { ring: "ring-gray-200", icon: "text-gray-700" },
//   }[tone] || {};
//   return (
//     <div className={`bg-white rounded-2xl shadow-sm ring-1 ${tones.ring} p-5`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500">{label}</p>
//           <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
//         </div>
//         {Icon ? <Icon className={`h-8 w-8 ${tones.icon}`} /> : null}
//       </div>
//     </div>
//   );
// };

// const Pill = ({ children, tone = "gray" }) => {
//   const tones = {
//     green: "bg-green-50 text-green-800",
//     amber: "bg-amber-50 text-amber-800",
//     red: "bg-red-50 text-red-800",
//     gray: "bg-gray-100 text-gray-800",
//     blue: "bg-blue-50 text-blue-800",
//   }[tone];
//   return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones}`}>{children}</span>;
// };

// const toNum = (v, d = 0) => (typeof v === "number" ? v : v != null ? Number(v) || d : d);

// function normalizeSummary(raw) {
//   const r = raw?.data && typeof raw.data === "object" ? raw.data : raw || {};
//   return {
//     totalUsers: toNum(r.total_users),
//     students: toNum(r.student_count),
//     lecturers: toNum(r.lecturer_count),
//     hods: toNum(r.hod_count),
//     departments: toNum(r.department_count),
//     units: toNum(r.unit_count),
//     pendingApprovals: toNum(r.pending_approvals),
//     openReports: toNum(r.open_reports),
//   };
// }

// function normalizeRecent(raw) {
//   const arr =
//     Array.isArray(raw) ? raw :
//     Array.isArray(raw?.data) ? raw.data :
//     Array.isArray(raw?.items) ? raw.items : [];
//   return arr.slice(0, 10).map((x) => ({
//     id: x.id ?? "",
//     kind: x.kind ?? "activity",
//     title: x.title ?? "—",
//     actor: x.actor ?? "System",
//     at: x.at ?? new Date().toISOString(),
//     meta: x.meta ?? {},
//   }));
// }

// function AdminDashboardInner() {
//   const [summary, setSummary] = useState(null);
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   async function fetchData() {
//     setLoading(true);
//     setErr("");
//     try {
//       const [sum, rec] = await Promise.all([
//         fetch(buildUrl(ADMIN_SUMMARY_URL), { headers: authHeaders(), credentials: "include" })
//           .then(async (r) => {
//             if (!r.ok) throw new Error(`Summary HTTP ${r.status}`);
//             return normalizeSummary(await r.json());
//           }),
//         fetch(buildUrl(ADMIN_RECENT_URL), { headers: authHeaders(), credentials: "include" })
//           .then(async (r) => {
//             if (!r.ok) throw new Error(`Recent HTTP ${r.status}`);
//             return normalizeRecent(await r.json());
//           }),
//       ]);
//       setSummary(sum);
//       setRecent(rec);
//     } catch (e) {
//       setErr(e.message || "Failed to load admin dashboard.");
//       setSummary(null);
//       setRecent([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const stats = useMemo(
//     () => ({
//       totalUsers: summary?.totalUsers ?? 0,
//       students: summary?.students ?? 0,
//       lecturers: summary?.lecturers ?? 0,
//       hods: summary?.hods ?? 0,
//       departments: summary?.departments ?? 0,
//       units: summary?.units ?? 0,
//       pendingApprovals: summary?.pendingApprovals ?? 0,
//       openReports: summary?.openReports ?? 0,
//     }),
//     [summary]
//   );

//   return (
//     <div>
//       <div className="flex items-start justify-between gap-4">
//         <p className="text-sm text-gray-600">Manage departments, users, units, and system health at a glance.</p>
//         {err && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
//       </div>

//       {loading ? (
//         <div className="flex h-40 items-center justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
//         </div>
//       ) : (
//         <>
//           <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             <StatCard label="Total Users" value={stats.totalUsers} Icon={UsersIcon} tone="blue" />
//             <StatCard label="Students" value={stats.students} Icon={UsersIcon} tone="green" />
//             <StatCard label="Lecturers" value={stats.lecturers} Icon={UsersIcon} tone="green" />
//             <StatCard label="HoDs" value={stats.hods} Icon={UsersIcon} tone="green" />
//             <StatCard label="Departments" value={stats.departments} Icon={BuildingOfficeIcon} tone="gray" />
//             <StatCard label="Units" value={stats.units} Icon={BookOpenIcon} tone="gray" />
//             <StatCard label="Pending Approvals" value={stats.pendingApprovals} Icon={ExclamationTriangleIcon} tone="amber" />
//             <StatCard label="Open Reports" value={stats.openReports} Icon={ClipboardDocumentCheckIcon} tone="red" />
//           </div>

//           <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
//             <section className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between px-5 py-4">
//                 <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
//                 <span className="text-xs text-gray-500">Last {Math.min(10, recent.length)} events</span>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-left">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <Th>Type</Th>
//                       <Th>Title</Th>
//                       <Th>Actor</Th>
//                       <Th>When</Th>
//                       <Th>Info</Th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100 bg-white">
//                     {recent.length === 0 ? (
//                       <tr>
//                         <td colSpan="5" className="px-5 py-6 text-center text-gray-500">No activity yet.</td>
//                       </tr>
//                     ) : (
//                       recent.map((r) => (
//                         <tr key={r.id} className="hover:bg-gray-50">
//                           <Td><Pill tone={r.kind === "error" ? "red" : r.kind === "warn" ? "amber" : "blue"}>{String(r.kind).toUpperCase()}</Pill></Td>
//                           <Td className="font-medium">{r.title}</Td>
//                           <Td>{r.actor}</Td>
//                           <Td className="whitespace-nowrap">{new Date(r.at).toLocaleString()}</Td>
//                           <Td className="text-xs text-gray-600">{r.meta?.unit ? `Unit: ${r.meta.unit}` : "—"}</Td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-semibold text-gray-900">System Snapshot</h2>
//                 <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
//               </div>
//               <div className="mt-4 space-y-3">
//                 <Row label="Users"><Pill tone="blue">{stats.totalUsers}</Pill></Row>
//                 <Row label="Students"><Pill tone="green">{stats.students}</Pill></Row>
//                 <Row label="Lecturers"><Pill tone="green">{stats.lecturers}</Pill></Row>
//                 <Row label="HoDs"><Pill tone="green">{stats.hods}</Pill></Row>
//                 <Row label="Departments"><Pill tone="gray">{stats.departments}</Pill></Row>
//                 <Row label="Units"><Pill tone="gray">{stats.units}</Pill></Row>
//                 <Row label="Pending Approvals"><Pill tone="amber">{stats.pendingApprovals}</Pill></Row>
//                 <Row label="Open Reports"><Pill tone="red">{stats.openReports}</Pill></Row>
//               </div>
//             </section>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function Row({ label, children }) {
//   return <div className="flex items-center justify-between"><span className="text-sm text-gray-600">{label}</span>{children}</div>;
// }
// function Th({ children }) {
//   return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
// }

// export default function AdminDashboard() {
//   return <AdminDashboardInner />;
// }



import React, { useEffect, useMemo, useState } from "react";
import {
  UsersIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

/** Env-based endpoints with safe defaults */
const API_BASE = (import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000").replace(/\/$/, "");
const ADMIN_SUMMARY_URL = import.meta.env.VITE_ADMIN_SUMMARY_URL || "/api/admin/summary";
const ADMIN_RECENT_URL = import.meta.env.VITE_ADMIN_RECENT_URL || "/api/admin/recent-activity";

const buildUrl = (u) => (u && u.startsWith("http") ? u : `${API_BASE}${u || ""}`);
const authHeaders = () => {
  const h = { Accept: "application/json" };
  const token = localStorage.getItem("token");
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

const StatCard = ({ label, value, Icon, tone = "green" }) => {
  const tones = {
    green: { ring: "ring-green-200", icon: "text-green-700" },
    blue: { ring: "ring-blue-200", icon: "text-blue-700" },
    amber: { ring: "ring-amber-200", icon: "text-amber-700" },
    red: { ring: "ring-red-200", icon: "text-red-700" },
    gray: { ring: "ring-gray-200", icon: "text-gray-700" },
  }[tone] || {};
  return (
    <div className={`bg-white rounded-2xl shadow-sm ring-1 ${tones.ring} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon ? <Icon className={`h-8 w-8 ${tones.icon}`} /> : null}
      </div>
    </div>
  );
};

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    green: "bg-green-50 text-green-800",
    amber: "bg-amber-50 text-amber-800",
    red: "bg-red-50 text-red-800",
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-50 text-blue-800",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones}`}>{children}</span>;
};

const toNum = (v, d = 0) => (typeof v === "number" ? v : v != null ? Number(v) || d : d);

function normalizeSummary(raw) {
  const r = raw?.data && typeof raw.data === "object" ? raw.data : raw || {};
  return {
    totalUsers: toNum(r.total_users),
    students: toNum(r.student_count),
    lecturers: toNum(r.lecturer_count),
    hods: toNum(r.hod_count),
    departments: toNum(r.department_count),
    units: toNum(r.unit_count),
    pendingApprovals: toNum(r.pending_approvals),
    openReports: toNum(r.open_reports),
  };
}

function normalizeRecent(raw) {
  const arr =
    Array.isArray(raw) ? raw :
    Array.isArray(raw?.data) ? raw.data :
    Array.isArray(raw?.items) ? raw.items : [];
  return arr.slice(0, 10).map((x) => ({
    id: x.id ?? "",
    kind: x.kind ?? "activity",
    title: x.title ?? "—",
    actor: x.actor ?? "System",
    at: x.at ?? new Date().toISOString(),
    meta: x.meta ?? {},
  }));
}

function AdminDashboardInner() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchData() {
    setLoading(true);
    setErr("");
    try {
      const [sum, rec] = await Promise.all([
        fetch(buildUrl(ADMIN_SUMMARY_URL), { headers: authHeaders(), credentials: "include" })
          .then(async (r) => {
            if (!r.ok) throw new Error(`Summary HTTP ${r.status}`);
            return normalizeSummary(await r.json());
          }),
        fetch(buildUrl(ADMIN_RECENT_URL), { headers: authHeaders(), credentials: "include" })
          .then(async (r) => {
            if (!r.ok) throw new Error(`Recent HTTP ${r.status}`);
            return normalizeRecent(await r.json());
          }),
      ]);
      setSummary(sum);
      setRecent(rec);
    } catch (e) {
      console.error("Dashboard fetch error:", e);
      setErr(e.message || "Failed to load admin dashboard.");
      setSummary(null);
      setRecent([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(
    () => ({
      totalUsers: summary?.totalUsers ?? 0,
      students: summary?.students ?? 0,
      lecturers: summary?.lecturers ?? 0,
      hods: summary?.hods ?? 0,
      departments: summary?.departments ?? 0,
      units: summary?.units ?? 0,
      pendingApprovals: summary?.pendingApprovals ?? 0,
      openReports: summary?.openReports ?? 0,
    }),
    [summary]
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-600">Manage departments, users, units, and system health at a glance.</p>
        {err && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <StatCard label="Total Users" value={stats.totalUsers} Icon={UsersIcon} tone="blue" />
            <StatCard label="Students" value={stats.students} Icon={UsersIcon} tone="green" />
            <StatCard label="Lecturers" value={stats.lecturers} Icon={UsersIcon} tone="green" />
            <StatCard label="HoDs" value={stats.hods} Icon={UsersIcon} tone="green" />
            <StatCard label="Departments" value={stats.departments} Icon={BuildingOfficeIcon} tone="gray" />
            <StatCard label="Units" value={stats.units} Icon={BookOpenIcon} tone="gray" />
            <StatCard label="Pending Approvals" value={stats.pendingApprovals} Icon={ExclamationTriangleIcon} tone="amber" />
            <StatCard label="Open Reports" value={stats.openReports} Icon={ClipboardDocumentCheckIcon} tone="red" />
          </div>

          {/* Recent + Snapshot */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activity */}
            <section className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <span className="text-xs text-gray-500">Last {Math.min(10, recent.length)} events</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>Type</Th>
                      <Th>Title</Th>
                      <Th>Actor</Th>
                      <Th>When</Th>
                      <Th>Info</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {recent.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-5 py-6 text-center text-gray-500">No activity yet.</td>
                      </tr>
                    ) : (
                      recent.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <Td><Pill tone={r.kind === "error" ? "red" : r.kind === "warn" ? "amber" : "blue"}>{String(r.kind).toUpperCase()}</Pill></Td>
                          <Td className="font-medium">{r.title}</Td>
                          <Td>{r.actor}</Td>
                          <Td className="whitespace-nowrap">{new Date(r.at).toLocaleString()}</Td>
                          <Td className="text-xs text-gray-600">{r.meta?.unit ? `Unit: ${r.meta.unit}` : "—"}</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* System Snapshot */}
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">System Snapshot</h2>
                <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-4 space-y-3">
                <Row label="Users"><Pill tone="blue">{stats.totalUsers}</Pill></Row>
                <Row label="Students"><Pill tone="green">{stats.students}</Pill></Row>
                <Row label="Lecturers"><Pill tone="green">{stats.lecturers}</Pill></Row>
                <Row label="HoDs"><Pill tone="green">{stats.hods}</Pill></Row>
                <Row label="Departments"><Pill tone="gray">{stats.departments}</Pill></Row>
                <Row label="Units"><Pill tone="gray">{stats.units}</Pill></Row>
                <Row label="Pending Approvals"><Pill tone="amber">{stats.pendingApprovals}</Pill></Row>
                <Row label="Open Reports"><Pill tone="red">{stats.openReports}</Pill></Row>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, children }) {
  return <div className="flex items-center justify-between"><span className="text-sm text-gray-600">{label}</span>{children}</div>;
}
function Th({ children }) {
  return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}

export default function AdminDashboard() {
  return <AdminDashboardInner />;
}
