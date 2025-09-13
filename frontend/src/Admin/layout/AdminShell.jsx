import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ heading = "Admin" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar: sticky & scrollable */}
      <aside className="sticky top-0 hidden h-screen overflow-y-auto md:block">
        <AdminSidebar />
      </aside>

      {/* Mobile drawer sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
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
        <AdminSidebar onNavigate={() => setOpen(false)} />
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Right side: header + content */}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 md:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-bold text-green-900 md:text-xl">{heading}</h1>
            </div>
          </div>
        </header>

        {/* 👇 This is where the clicked page renders */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* React Router will mount the matched child route here */}
          {/* eslint-disable-next-line react/no-children-prop */}
          <OutletShim />
        </main>
      </div>
    </div>
  );
}

/**
 * Tiny shim so we can avoid importing Outlet here if you prefer not to.
 * Replace with: `import { Outlet } from "react-router-dom";` and use <Outlet />
 */
import { Outlet } from "react-router-dom";
function OutletShim() { return <Outlet />; }
