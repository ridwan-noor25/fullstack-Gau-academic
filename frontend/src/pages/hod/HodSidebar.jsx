// // src/pages/hod/HodSidebar.jsx
// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   Squares2X2Icon,
//   UsersIcon,
//   BookOpenIcon,
//   BoltIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/outline";

// const linkBase =
//   "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-green-50 hover:text-green-800";
// const active =
//   "bg-green-100 text-green-800 border border-green-200";

// export default function HodSidebar({ open = true, onToggle }) {
//   return (
//     <div className="rounded-2xl border bg-white shadow-sm p-4">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="h-10 w-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
//             H
//           </div>
//           <div>
//             <div className="text-sm text-gray-500">HoD Portal</div>
//             <div className="font-semibold">Department Console</div>
//           </div>
//         </div>
//         <button
//           className="inline-flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50"
//           onClick={onToggle}
//           title="Toggle"
//         >
//           <Bars3Icon className="h-5 w-5 text-gray-700" />
//         </button>
//       </div>

//       <nav className={`space-y-1 ${open ? "block" : "hidden sm:block"}`}>
//         <NavLink
//           to="/hod/dashboard"
//           className={({ isActive }) => `${linkBase} ${isActive ? active : "text-gray-700"}`}
//           end
//         >
//           <Squares2X2Icon className="h-5 w-5" />
//           Dashboard
//         </NavLink>

//         <NavLink
//           to="/hod/lecturers"
//           className={({ isActive }) => `${linkBase} ${isActive ? active : "text-gray-700"}`}
//         >
//           <UsersIcon className="h-5 w-5" />
//           Lecturers
//         </NavLink>

//         <NavLink
//           to="/hod/units"
//           className={({ isActive }) => `${linkBase} ${isActive ? active : "text-gray-700"}`}
//         >
//           <BookOpenIcon className="h-5 w-5" />
//           Units & Publish
//         </NavLink>

//         {/* <div className="pt-2 mt-2 border-t">
//           <a
//             href="https://www.gau.ac.ke"
//             target="_blank"
//             rel="noreferrer"
//             className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800"
//           >
//             <BoltIcon className="h-5 w-5" />
//             University Website
//           </a> */}
//         {/* </div> */}
//       </nav>
//     </div>
//   );
// }


// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   Squares2X2Icon,
//   UsersIcon,
//   BookOpenIcon,
//   ChevronDoubleLeftIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// const nav = [
//   { to: "/hod/dashboard", label: "Dashboard", icon: Squares2X2Icon },
//   { to: "/hod/lecturers", label: "Lecturers", icon: UsersIcon },
//   { to: "/hod/units", label: "Units & Publish", icon: BookOpenIcon },
// ];

// export default function HodSidebar({ open, onClose, onOpen }) {
//   return (
//     <>
//       {/* Desktop: rail with its own scroll, NOT fixed to the viewport */}
//       <aside
//         className={`hidden lg:flex shrink-0 transition-all duration-300
//           ${open ? "w-[280px]" : "w-[84px]"}
//           h-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden`}
//       >
//         <div className="flex h-full w-full flex-col">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-4 border-b">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
//                 H
//               </div>
//               {open && (
//                 <div className="leading-tight">
//                   <div className="text-sm font-semibold text-gray-900">HoD Portal</div>
//                   <div className="text-xs text-gray-500">Department Console</div>
//                 </div>
//               )}
//             </div>

//             {/* Collapse button (only when open) */}
//             {open && (
//               <button
//                 onClick={onClose}
//                 className="ml-2 inline-flex items-center rounded-lg border px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
//                 title="Collapse"
//                 aria-label="Collapse"
//               >
//                 <ChevronDoubleLeftIcon className="h-5 w-5" />
//               </button>
//             )}
//           </div>

//           {/* Nav — this area scrolls independently */}
//           <nav className="flex-1 overflow-y-auto py-3">
//             {nav.map(({ to, label, icon: Icon }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 className={({ isActive }) =>
//                   `group mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
//                   ${
//                     isActive
//                       ? "bg-green-50 text-green-800"
//                       : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                   }`
//                 }
//               >
//                 <Icon className="h-5 w-5 shrink-0" />
//                 {open && <span className="truncate">{label}</span>}
//               </NavLink>
//             ))}
//           </nav>

//           {/* Footer note (only when open) */}
//           {open && (
//             <div className="px-4 py-3 border-t text-xs text-gray-500">
//               Garissa University • HoD
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Mobile overlay drawer */}
//       <div
//         className={`lg:hidden fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
//         aria-hidden={!open}
//       >
//         {/* Backdrop */}
//         <div
//           className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
//           onClick={onClose}
//         />

//         {/* Drawer */}
//         <aside
//           className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300
//           ${open ? "translate-x-0" : "-translate-x-full"}`}
//         >
//           <div className="flex h-full flex-col">
//             <div className="flex items-center justify-between px-4 py-4 border-b">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
//                   H
//                 </div>
//                 <div className="leading-tight">
//                   <div className="text-sm font-semibold text-gray-900">HoD Portal</div>
//                   <div className="text-xs text-gray-500">Department Console</div>
//                 </div>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="inline-flex items-center rounded-lg border px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
//                 aria-label="Close menu"
//                 title="Close menu"
//               >
//                 <XMarkIcon className="h-5 w-5" />
//               </button>
//             </div>

//             <nav className="flex-1 overflow-y-auto py-3">
//               {nav.map(({ to, label, icon: Icon }) => (
//                 <NavLink
//                   key={to}
//                   to={to}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     `group mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
//                     ${
//                       isActive
//                         ? "bg-green-50 text-green-800"
//                         : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                     }`
//                   }
//                 >
//                   <Icon className="h-5 w-5 shrink-0" />
//                   <span className="truncate">{label}</span>
//                 </NavLink>
//               ))}
//             </nav>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }



// src/pages/hod/HodSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function HodSidebar({ onNavigate /*, open, onClose, onOpen */ }) {
  const loc = useLocation();

  // keep your original nav content (destinations & labels), just match lecturer styles
  const items = [
    { name: "Dashboard", href: "/hod/dashboard", icon: Squares2X2Icon },
    { name: "Lecturers", href: "/hod/lecturers", icon: UsersIcon },
    { name: "Units & Publish", href: "/hod/units", icon: BookOpenIcon },
  ];

  const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

  function logout() {
    // mirror lecturer sidebar behavior; keep keys lightweight
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("hod");
    window.location.href = "/login";
  }

  return (
    <div className="h-full w-64 border-r bg-white flex flex-col">
      {/* Header (styled like the lecturer header) */}
      <div className="h-16 border-b flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold">GAU-GradeView</h1>
          <p className="text-xs text-gray-500">HoD Portal</p>
        </div>
      </div>

      {/* Nav list (same active/hover styles as lecturer) */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((it) => {
          const ActiveIcon = it.icon;
          const active = isActive(it.href);
          return (
            <Link
              key={it.name}
              to={it.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                active
                  ? "bg-gray-100 text-green-800 font-semibold border-l-4 border-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ActiveIcon className="w-5 h-5" />
              {it.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer logout (same as lecturer) */}
      <div className="border-t p-3">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
