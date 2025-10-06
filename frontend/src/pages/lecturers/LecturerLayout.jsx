

// import { useEffect, useState } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import { Bars3Icon } from "@heroicons/react/24/outline";
// import LecturerSidebar from "./LecturerSidebar";
// import { getLecturerMe } from "../../utils/lecturerApi";

// const initials = (name) =>
//   name ? name.trim().split(/\s+/).map((n) => n[0]).join("").toUpperCase() : "L";

// export default function LecturerLayout() {
//   const [open, setOpen] = useState(false); // mobile drawer
//   const [collapsed, setCollapsed] = useState(true); // ✅ collapsed by default
//   const [me, setMe] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     setOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     async function load() {
//       const cache = localStorage.getItem("user") || localStorage.getItem("lecturer");
//       if (cache) {
//         try {
//           setMe(JSON.parse(cache));
//         } catch {}
//       }
//       try {
//         const fresh = await getLecturerMe();
//         if (fresh) {
//           setMe(fresh);
//           localStorage.setItem("lecturer", JSON.stringify(fresh));
//         }
//       } catch {}
//     }
//     load();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white flex">
//       {/* Desktop sidebar */}
//       <aside className="hidden md:block">
//         <LecturerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
//       </aside>

//       {/* Mobile sidebar */}
//       <aside
//         className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <LecturerSidebar onNavigate={() => setOpen(false)} collapsed={false} setCollapsed={() => {}} />
//       </aside>
//       {open && (
//         <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />
//       )}

//       {/* Main */}
//       <div
//         className={`flex-1 min-w-0 transition-all duration-300 ${
//           collapsed ? "ml-16" : "ml-64"
//         }`}
//       >
//         {/* ✅ Header now aligned with sidebar */}
//         <header className="bg-white shadow-sm sticky top-0 z-30">
//           <div className="px-4 sm:px-6 lg:px-8">
//             <div className="h-16 flex items-center justify-between">
//               {/* Left side */}
//               <div className="flex items-center gap-2">
//                 <button
//                   type="button"
//                   className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
//                   onClick={() => setOpen(true)}
//                   aria-label="Open sidebar"
//                 >
//                   <Bars3Icon className="w-6 h-6" />
//                 </button>
//                 <h1 className="text-xl font-bold text-green-800">Lecturer Dashboard</h1>
//               </div>

//               {/* Right side */}
//               <div className="flex items-center">
//                 <div className="h-8 w-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold">
//                   {initials(me?.name)}
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-gray-900">{me?.name || "Lecturer"}</p>
//                   <p className="text-xs text-gray-500">{me?.email || "—"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main content */}
//         <main className="px-4 sm:px-6 lg:px-8 py-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }



// src/pages/lecturers/LecturerLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LecturerSidebar from "./LecturerSidebar";
import { getLecturerMe } from "../../utils/lecturerApi";

const initials = (name) =>
  name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "L";

export default function LecturerLayout() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(true); // ✅ collapsed by default
  const [me, setMe] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    async function load() {
      const cache =
        localStorage.getItem("user") || localStorage.getItem("lecturer");
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
        <LecturerSidebar
          onNavigate={() => setOpen(false)}
          collapsed={false}
          setCollapsed={() => {}}
        />
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div
        className={`flex-1 min-w-0 transition-all duration-300 ${
          collapsed ? "ml-0" : "ml-0"
        }`}
      >
        {/* ✅ Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              {/* Left side */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  onClick={() => setOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-green-800">
                  Lecturer Dashboard
                </h1>
              </div>

              {/* Right side */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold">
                  {initials(me?.name)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {me?.name || "Lecturer"}
                  </p>
                  <p className="text-xs text-gray-500">{me?.email || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
