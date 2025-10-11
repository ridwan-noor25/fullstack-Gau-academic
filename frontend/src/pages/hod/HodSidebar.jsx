


import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  Squares2X2Icon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function HodSidebar({ open, onClose, onOpen }) {
  const loc = useLocation();
  const { logout: authLogout } = useAuth();

  const items = [
    { name: "Dashboard", href: "/hod/dashboard", icon: Squares2X2Icon },
    { name: "Lecturers", href: "/hod/lecturers", icon: UsersIcon },
    { name: "Units & Publish", href: "/hod/units", icon: BookOpenIcon },
    { name: "Manage Students", href: "/hod/students", icon: AcademicCapIcon },
    { name: "Transcripts", href: "/hod/transcripts", icon: AcademicCapIcon },
  ];

  const isActive = (p) => loc.pathname === p || loc.pathname.startsWith(p + "/");

  function logout() {
    authLogout(); // Clear auth context state
    window.location.href = "/"; // Use window.location to bypass React Router
  }

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="lg:hidden fixed top-16 inset-x-0 bottom-0 z-20 bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:static top-16 lg:top-0 inset-y-0 left-0 z-30 w-64 
          transform transition-transform duration-300 ease-in-out
          lg:transform-none
          h-[calc(100vh-4rem)] lg:h-full border-r bg-white flex flex-col
        `}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="text-center flex-1">
            <h1 className="font-bold">GAU-GradeView</h1>
            <p className="text-xs text-gray-500">HoD Portal</p>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
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
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  active
                    ? "bg-green-50 text-green-800 font-semibold border-l-4 border-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ActiveIcon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{it.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer logout */}
        <div className="border-t p-3">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
