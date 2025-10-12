// src/pages/students/dashboard/StudentLayout.jsx
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function StudentLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => {
      const isLarge = window.innerWidth >= 1024;
      setOpen(isLarge);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  }, [location.pathname]);

  const titleMap = {
    "/student": "Student Dashboard",
    "/student/dashboard": "Student Dashboard",
    "/student/enroll": "Enroll Units",
    "/student/grades": "My Grades",
    "/student/report": "Report Missing Marks",
    "/student/report-missing": "Report Missing Marks",
    "/student/reports": "Missing Marks",
  };
  
  const pageTitle =
    titleMap[location.pathname] ||
    (location.pathname.startsWith("/student/enroll") ? "Enroll Units" :
     location.pathname.startsWith("/student/grades") ? "My Grades" : "Student");

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center gap-3">
          {!open && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
              aria-label="Open menu"
              title="Open menu"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{pageTitle}</h1>
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex h-[calc(100vh-140px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)] gap-4 sm:gap-6">
          <StudentSidebar 
            open={open} 
            onClose={() => setOpen(false)} 
            onOpen={() => setOpen(true)} 
          />
          
          {/* Main content */}
          <main className="flex-1 h-full overflow-hidden">
            <div className="h-full rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="h-full overflow-y-auto p-4 sm:p-5 lg:p-6">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
