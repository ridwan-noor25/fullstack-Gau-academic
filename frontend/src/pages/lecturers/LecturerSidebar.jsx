// // src/pages/lecturers/LecturerSidebar.jsx
// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   BookOpenIcon,
//   UsersIcon,
//   InboxIcon,
//   ArrowRightOnRectangleIcon,
// } from "@heroicons/react/24/outline";

// export default function LecturerSidebar({ onNavigate }) {
//   const loc = useLocation();
//   const items = [
//     { name: "Dashboard", href: "/lecturer/dashboard", icon: HomeIcon },
//     { name: "My Units", href: "/lecturer/units", icon: BookOpenIcon },
//     { name: "Missing Reports", href: "/lecturer/missing-reports", icon: InboxIcon },
//   ];
//   const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

//   function logout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("lecturer");
//     window.location.href = "/login";
//   }

//   return (
//     <div className="h-full w-64 border-r bg-white flex flex-col">
//       <div className="h-16 border-b flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="font-bold">GAU-GradeView</h1>
//           <p className="text-xs text-gray-500">Lecturer Portal</p>
//         </div>
//       </div>

//       <nav className="flex-1 overflow-y-auto p-2 space-y-1">
//         {items.map((it) => {
//           const ActiveIcon = it.icon;
//           const active = isActive(it.href);
//           return (
//             <Link
//               key={it.name}
//               to={it.href}
//               onClick={onNavigate}
//               className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
//                 active
//                   ? "bg-gray-100 text-green-800 font-semibold border-l-4 border-green-700"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               <ActiveIcon className="w-5 h-5" /> {it.name}
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="border-t p-3">
//         <button
//           onClick={logout}
//           className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
//         >
//           <ArrowRightOnRectangleIcon className="w-5 h-5" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }





// // src/pages/lecturers/LecturerSidebar.jsx
// import { Link, useLocation } from "react-router-dom";
// import {
//   HomeIcon,
//   BookOpenIcon,
//   InboxIcon,
//   ArrowRightOnRectangleIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/outline";
// import { useState } from "react";

// export default function LecturerSidebar({ onNavigate }) {
//   const loc = useLocation();
//   const [collapsed, setCollapsed] = useState(true); // ✅ default collapsed (icons only)

//   const items = [
//     { name: "Dashboard", href: "/lecturer/dashboard", icon: HomeIcon },
//     { name: "My Units", href: "/lecturer/units", icon: BookOpenIcon },
//     { name: "Missing Reports", href: "/lecturer/missing-reports", icon: InboxIcon },
//   ];
//   const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

//   function logout() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("lecturer");
//     window.location.href = "/login";
//   }

//   return (
//     <div
//       className={`h-full ${
//         collapsed ? "w-16" : "w-64"
//       } border-r bg-white flex flex-col transition-all duration-300`}
//     >
//       {/* Header with collapse button */}
//       <div className="h-16 border-b flex items-center justify-between px-2">
//         {!collapsed && (
//           <div className="text-center flex-1">
//             <h1 className="font-bold text-green-800 text-sm">GAU-GradeView</h1>
//             <p className="text-[11px] text-gray-500">Lecturer Portal</p>
//           </div>
//         )}
//         <button
//           onClick={() => setCollapsed((v) => !v)}
//           className="p-2 rounded-md hover:bg-gray-100"
//         >
//           <Bars3Icon className="w-5 h-5 text-gray-700" />
//         </button>
//       </div>

//       {/* Nav links */}
//       <nav className="flex-1 overflow-y-auto p-2 space-y-1">
//         {items.map((it) => {
//           const ActiveIcon = it.icon;
//           const active = isActive(it.href);
//           return (
//             <Link
//               key={it.name}
//               to={it.href}
//               onClick={onNavigate}
//               className={`flex items-center ${
//                 collapsed ? "justify-center" : "gap-3 px-4"
//               } py-2 rounded-md transition ${
//                 active
//                   ? "bg-gray-100 text-green-800 font-semibold border-l-4 border-green-700"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//               title={collapsed ? it.name : undefined} // ✅ Tooltip when collapsed
//             >
//               <ActiveIcon className="w-5 h-5" />
//               {!collapsed && it.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Logout button */}
//       <div className="border-t p-3">
//         <button
//           onClick={logout}
//           className={`w-full flex items-center ${
//             collapsed ? "justify-center" : "gap-3 px-4"
//           } py-2 rounded-md text-gray-700 hover:bg-gray-100 transition`}
//           title={collapsed ? "Logout" : undefined}
//         >
//           <ArrowRightOnRectangleIcon className="w-5 h-5" />
//           {!collapsed && "Logout"}
//         </button>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LecturerSidebar from "./LecturerSidebar";
import { getLecturerMe } from "../../utils/lecturerApi";

const initials = (name) =>
  name ? name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase() : "L";

export default function LecturerLayout() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(true); // ✅ collapsed by default on desktop
  const [me, setMe] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    async function load() {
      const cache = localStorage.getItem("user") || localStorage.getItem("lecturer");
      if (cache) {
        try {
          setMe(JSON.parse(cache));
        } catch {}
      }
      try {
        const fresh = await getLecturerMe();
        if (fresh) {
          setMe(fresh);
          localStorage.setItem("lecturer", JSON.stringify(fresh));
        }
      } catch {}
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:block">
        <LecturerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <LecturerSidebar onNavigate={() => setOpen(false)} collapsed={false} setCollapsed={() => {}} />
      </aside>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  onClick={() => setOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-green-800">Lecturer Dashboard</h1>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold">
                  {initials(me?.name)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{me?.name || "Lecturer"}</p>
                  <p className="text-xs text-gray-500">{me?.email || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
