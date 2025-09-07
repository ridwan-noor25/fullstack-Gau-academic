// // src/pages/hod/HodLayout.jsx
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import HodSidebar from "./HodSidebar";

// export default function HodLayout() {
//   const [open, setOpen] = useState(true);

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-gray-50"> {/* leave room for your Navbar */}
//       <div className="mx-auto max-w-7xl px-4 py-6">
//         <div className="grid grid-cols-12 gap-6">
//           {/* Sidebar */}
//           <aside className={`col-span-12 sm:col-span-4 lg:col-span-3`}>
//             <HodSidebar open={open} onToggle={() => setOpen((v) => !v)} />
//           </aside>

//           {/* Main */}
//           <main className="col-span-12 sm:col-span-8 lg:col-span-9">
//             <div className="rounded-2xl border bg-white shadow-sm p-4 md:p-6">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HodSidebar from "./HodSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function HodLayout() {
  const location = useLocation();

  // Sidebar: open on desktop (lg+), closed on mobile
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const titleMap = {
    "/hod": "HoD Dashboard",
    "/hod/dashboard": "HoD Dashboard",
    "/hod/lecturers": "Manage Lecturers",
    "/hod/units": "Units & Publish",
  };
  const pageTitle =
    titleMap[location.pathname] ||
    (location.pathname.startsWith("/hod/lecturers")
      ? "Manage Lecturers"
      : location.pathname.startsWith("/hod/units")
      ? "Units & Publish"
      : "HoD");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Mobile top bar: only shows hamburger when sidebar is closed */}
      <div className="lg:hidden sticky top-0 z-30 bg-gray-50/80 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-gray-700 hover:bg-gray-100"
              aria-label="Open menu"
              title="Open menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        </div>
      </div>

      {/* Viewport shell: lock page scroll and give each pane its own scroll */}
      <div className="mx-auto max-w-7xl px-4 py-6 h-[calc(100vh-96px)] overflow-hidden">
        <div className="flex h-full gap-6">
          {/* Sidebar (desktop rail or mobile drawer) */}
          <HodSidebar open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} />

          {/* Content pane — independent scrolling */}
          <main className="flex-1 h-full overflow-y-auto">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
