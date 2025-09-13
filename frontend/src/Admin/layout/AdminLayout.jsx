// import React, { useState, useEffect } from "react";
// import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
// import AdminSidebar from "./AdminSidebar";

// export default function AdminLayout({ children, heading = "Admin", openLinksInNewTab = false }) {
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     const close = () => setOpen(false);
//     window.addEventListener("resize", close);
//     return () => window.removeEventListener("resize", close);
//   }, []);

//   return (
//     <div className="min-h-screen bg-white md:grid md:grid-cols-[16rem_1fr]">
//       {/* Desktop Sidebar (sticky + its own scroll) */}
//       <aside className="sticky top-0 hidden h-screen overflow-y-auto md:block">
//         <AdminSidebar openInNewTab={openLinksInNewTab} />
//       </aside>

//       {/* Mobile Drawer Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform md:hidden ${
//           open ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="flex h-12 items-center justify-between border-b px-3">
//           <span className="text-sm font-semibold text-green-800">Menu</span>
//           <button
//             className="rounded p-1 hover:bg-gray-100"
//             onClick={() => setOpen(false)}
//             aria-label="Close sidebar"
//           >
//             <XMarkIcon className="h-5 w-5" />
//           </button>
//         </div>
//         <AdminSidebar onNavigate={() => setOpen(false)} openInNewTab={openLinksInNewTab} />
//       </aside>
//       {open && (
//         <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
//       )}

//       {/* Content */}
//       <div className="min-w-0">
//         {/* Header (mobile menu button) */}
//         <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//           <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 md:hidden"
//                 onClick={() => setOpen(true)}
//                 aria-label="Open sidebar"
//               >
//                 <Bars3Icon className="h-6 w-6" />
//               </button>
//               <h1 className="text-lg font-bold text-green-900 md:text-xl">{heading}</h1>
//             </div>
//           </div>
//         </header>

//         <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
  heading = "Admin",
  openLinksInNewTab = false,
}) {
  const [open, setOpen] = useState(false);

  // Close drawer on window resize (e.g., when rotating or resizing to desktop)
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  // Close on ESC & lock body scroll while drawer is open (mobile)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    // lock body scroll when drawer is open (mobile)
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = original || "";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original || "";
    };
  }, [open]);

  return (
    <div className="min-h-svh bg-white md:grid md:grid-cols-[16rem_1fr]">
      {/* Desktop Sidebar (sticky + its own scroll) */}
      <aside className="sticky top-0 hidden h-dvh overflow-y-auto md:block">
        <AdminSidebar openInNewTab={openLinksInNewTab} />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
      >
        <div className="flex h-12 items-center justify-between border-b px-3">
          <span className="text-sm font-semibold text-green-800">Menu</span>
          <button
            className="rounded p-1 hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="h-[calc(100dvh-3rem)] overflow-y-auto">
          <AdminSidebar
            onNavigate={() => setOpen(false)}
            openInNewTab={openLinksInNewTab}
          />
        </div>
      </aside>

      {/* Backdrop (mobile) */}
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu backdrop"
        />
      )}

      {/* Content */}
      <div className="min-w-0">
        {/* Header (mobile menu button) */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-green-900">
                {heading}
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8 py-5 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
