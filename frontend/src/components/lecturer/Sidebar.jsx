// src/components/lecturer/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { to: "/lecturer/dashboard", label: "Overview", icon: "🏠" },
  { to: "/lecturer/gradebook", label: "Gradebook", icon: "📘" },
  { to: "/lecturer/missing-marks", label: "Missing Marks", icon: "📝" },
  { to: "/lecturer/courses", label: "Courses", icon: "🎓" },
  { to: "/lecturer/notifications", label: "Notifications", icon: "🔔" },
  { to: "/lecturer/profile", label: "Profile", icon: "👤" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-gray-100 bg-white p-4 md:block">
      <div className="mb-6 px-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          GAU-GradeView
        </div>
        <div className="text-lg font-bold">Lecturer</div>
      </div>
      <nav className="space-y-1">
        {items.map((i) => {
          const active = pathname.startsWith(i.to);
          return (
            <Link
              key={i.to}
              to={i.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                active ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{i.icon}</span>
              <span>{i.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50 to-white p-3 text-xs text-gray-600">
        <div className="font-semibold text-emerald-700">Tip</div>
        Keep grades updated weekly to avoid missing-mark requests.
      </div>
    </aside>
  );
}
