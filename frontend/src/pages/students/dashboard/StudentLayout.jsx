// src/pages/students/dashboard/StudentLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function StudentLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const titleMap = {
    "/student": "Student Dashboard",
    "/student/dashboard": "Student Dashboard",
    "/student/enroll": "Enroll Units",
    "/student/grades": "My Grades",
    "/student/report": "Report Missing Marks",
    "/student/report-missing": "Report Missing Marks",
    // "/student/profile": "Profile",
    // "/student/settings": "Settings",
  };
  const pageTitle =
    titleMap[location.pathname] ||
    (location.pathname.startsWith("/student/enroll") ? "Enroll Units" :
     location.pathname.startsWith("/student/grades") ? "My Grades" : "Student");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Mobile top bar — hamburger appears only when sidebar is closed */}
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

      {/* Independent scroll regions */}
      <div className="mx-auto max-w-7xl px-4 py-6 h-[calc(100vh-96px)] overflow-hidden">
        <div className="flex h-full gap-6">
          <StudentSidebar open={open} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} />
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
