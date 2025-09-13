// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   HomeIcon,
//   PlusCircleIcon,
//   BuildingOfficeIcon,
//   BookOpenIcon,
//   AcademicCapIcon,
//   ClipboardDocumentListIcon,
//   MegaphoneIcon,
// } from "@heroicons/react/24/outline";

// const nav = [
//   { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
//   { to: "/admin/register", label: "Create User", icon: PlusCircleIcon },
//   { to: "/admin/departments", label: "Departments", icon: BuildingOfficeIcon },
// //   { to: "/admin/units", label: "Units", icon: BookOpenIcon },
// //   { to: "/admin/enroll", label: "Enroll Students", icon: AcademicCapIcon },
// //   { to: "/admin/pending", label: "Pending Grades", icon: ClipboardDocumentListIcon },
// //   { to: "/admin/publish", label: "Publish Unit", icon: MegaphoneIcon },
// ];

// export default function AdminSidebar({ onNavigate }) {
//   return (
//     <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
//       {/* Brand */}
//       <div className="flex h-16 items-center justify-center border-b">
//         <div className="text-center">
//           <h1 className="text-base font-bold text-green-800">GAU-GradeView</h1>
//           <p className="text-[11px] text-gray-500">Admin Console</p>
//         </div>
//       </div>

//       {/* Nav */}
//       <nav className="flex-1 overflow-y-auto px-2 py-3">
//         {nav.map(({ to, label, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             onClick={onNavigate}
//             className={({ isActive }) =>
//               `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
//                ${isActive
//                  ? "bg-gray-100 font-semibold text-green-800 ring-1 ring-green-200"
//                  : "text-gray-700 hover:bg-gray-50"}`
//             }
//           >
//             <Icon className="h-5 w-5" />
//             <span>{label}</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="border-t p-3">
//         <p className="text-[11px] text-gray-500">Garissa University · GAU-GradeView</p>
//       </div>
//     </div>
//   );
// }



// src/pages/admin/AdminSidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  BuildingOfficeIcon,
  // BookOpenIcon,
  // AcademicCapIcon,
  // ClipboardDocumentListIcon,
  // MegaphoneIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/admin/register", label: "Create User", icon: PlusCircleIcon },
  { to: "/admin/departments", label: "Departments", icon: BuildingOfficeIcon },
  // { to: "/admin/units", label: "Units", icon: BookOpenIcon },
  // { to: "/admin/enroll", label: "Enroll Students", icon: AcademicCapIcon },
  // { to: "/admin/pending", label: "Pending Grades", icon: ClipboardDocumentListIcon },
  // { to: "/admin/publish", label: "Publish Unit", icon: MegaphoneIcon },
];

export default function AdminSidebar({ onNavigate }) {
  const loc = useLocation();
  const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

  function logout() {
    // same behavior pattern as Lecturer sidebar
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="h-full w-64 border-r bg-white flex flex-col">
      {/* Brand */}
      <div className="h-16 border-b flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold text-green-800">GAU-GradeView</h1>
          <p className="text-[11px] text-gray-500">Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {nav.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                ${active
                  ? "bg-gray-100 text-green-800 font-semibold border-l-4 border-green-700"
                  : "text-gray-700 hover:bg-gray-100"}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Logout (visual parity with Lecturer) */}
      <div className="border-t p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
