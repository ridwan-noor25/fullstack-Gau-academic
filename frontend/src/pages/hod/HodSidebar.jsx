


import { Link, useLocation } from "react-router-dom";
import {
  Squares2X2Icon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function HodSidebar({ onNavigate /*, open, onClose, onOpen */ }) {
  const loc = useLocation();

const items = [
  { name: "Dashboard", href: "/hod/dashboard", icon: Squares2X2Icon },
  { name: "Lecturers", href: "/hod/lecturers", icon: UsersIcon },
  { name: "Units & Publish", href: "/hod/units", icon: BookOpenIcon },
  { name: "Manage Students", href: "/hod/students", icon: AcademicCapIcon }, // ✅ fixed
];



  const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("hod");
    window.location.href = "/login";
  }

  return (
    <div className="h-full w-64 border-r bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-bold">GAU-GradeView</h1>
          <p className="text-xs text-gray-500">HoD Portal</p>
        </div>
      </div>

      {/* Nav list */}
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

      {/* Footer logout */}
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
