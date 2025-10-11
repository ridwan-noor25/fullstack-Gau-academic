import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  HomeIcon,
  PlusCircleIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/admin/register", label: "Create User", icon: PlusCircleIcon },
  { to: "/admin/departments", label: "Departments", icon: BuildingOfficeIcon },
//   { to: "/admin/units", label: "Units", icon: BookOpenIcon },
//   { to: "/admin/enroll", label: "Enroll Students", icon: AcademicCapIcon },
//   { to: "/admin/pending", label: "Pending Grades", icon: ClipboardDocumentListIcon },
//   { to: "/admin/publish", label: "Publish Unit", icon: MegaphoneIcon },
];

export default function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();
  const { logout: authLogout } = useAuth();

  const logout = () => {
    authLogout(); // Clear auth context state
    window.location.href = "/"; // Use window.location to bypass React Router
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center justify-center border-b">
        <div className="text-center">
          <h1 className="text-base font-bold text-green-800">GAU-GradeView</h1>
          <p className="text-[11px] text-gray-500">Admin Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
               ${isActive
                 ? "bg-gray-100 font-semibold text-green-800 ring-1 ring-green-200"
                 : "text-gray-700 hover:bg-gray-50"}`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        {/* Logout button */}
        <button
          onClick={logout}
          className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
        
        <p className="text-[11px] text-gray-500">Garissa University · GAU-GradeView</p>
      </div>
    </div>
  );
}
