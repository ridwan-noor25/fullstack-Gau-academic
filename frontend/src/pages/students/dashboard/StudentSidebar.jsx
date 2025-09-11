// src/pages/students/dashboard/StudentSidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const nav = [
  { to: "/student/dashboard", label: "Dashboard", icon: Squares2X2Icon },
  { to: "/student/enroll", label: "Enroll Units", icon: BookOpenIcon },
  { to: "/student/grades", label: "My Grades", icon: ClipboardDocumentListIcon },
  { to: "/student/report", label: "Missing Marks", icon: FlagIcon },
  { to: "/student/profile", label: "Profile", icon: UserCircleIcon },
  { to: "/student/settings", label: "Settings", icon: Cog6ToothIcon },
];

export default function StudentSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Desktop rail */}
      <aside
        className={`hidden lg:flex shrink-0 transition-all duration-300
          ${open ? "w-[280px]" : "w-[84px]"}
          h-full rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">
                S
              </div>
              {open && (
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">Student</div>
                  <div className="text-xs text-gray-500">GAU Portal</div>
                </div>
              )}
            </div>
            {open && (
              <button
                onClick={onClose}
                className="ml-2 inline-flex items-center rounded-lg border px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
                title="Collapse"
                aria-label="Collapse"
              >
                <ChevronDoubleLeftIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto py-3">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                  ${
                    isActive
                      ? "bg-green-50 text-green-800"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="px-3 py-3 border-t">
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {open && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
        <aside className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">S</div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">Student</div>
                  <div className="text-xs text-gray-500">GAU Portal</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="inline-flex items-center rounded-lg border px-2.5 py-1.5 text-gray-600 hover:bg-gray-50"
                aria-label="Close menu"
                title="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-3">
              {nav.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition
                    ${
                      isActive
                        ? "bg-green-50 text-green-800"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="px-3 py-3 border-t">
              <button
                onClick={logout}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
