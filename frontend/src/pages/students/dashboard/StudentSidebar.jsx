
// src/pages/students/dashboard/StudentSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import {
  Squares2X2Icon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// nav items (unchanged content)
const nav = [
  { to: "/student/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/student/enroll", label: "Enroll Units", icon: BookOpenIcon },
  { to: "/student/grades", label: "My Grades", icon: ClipboardDocumentListIcon },
  { to: "/student/reports", label: "Missing Marks", icon: FlagIcon },
  // { to: "/student/transcript", label: "Transcript", icon: FlagIcon },

];

export default function StudentSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();
  
  const logout = () => {
    authLogout(); // Clear auth context state
    window.location.href = "/"; // Use window.location to bypass React Router
  };

  return (
    <>
      {/* ---------- Desktop sidebar ---------- */}
      <aside className="hidden lg:flex h-full w-56 xl:w-64 flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Header */}
        <div className="h-14 xl:h-16 border-b border-gray-200 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-sm xl:text-base font-bold text-gray-900">GAU-GradeView</h1>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 xl:p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-800 font-semibold border-l-4 border-green-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm xl:text-base truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer logout */}
        <div className="border-t border-gray-200 p-2 xl:p-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm xl:text-base">Logout</span>
          </button>
        </div>
      </aside>

      {/* ---------- Mobile drawer ---------- */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />
        
        {/* Drawer */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 sm:w-80 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Mobile header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-gray-50">
              <div className="text-left">
                <h1 className="text-base font-bold text-gray-900 leading-none">GAU-GradeView</h1>
                <p className="text-xs text-gray-500 mt-0.5">Student Portal</p>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-lg border border-gray-300 px-2.5 py-2 text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Close menu"
                title="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile navigation */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {nav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-50 text-green-800 font-semibold border-l-4 border-green-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base">{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile logout */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
                <span className="text-base">Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

