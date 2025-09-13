// src/components/hod/Layout.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function HodLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold tracking-wide">GAU-GradeView</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavItem to="/hod">Dashboard</NavItem>
            <NavItem to="/hod/reports">Reports</NavItem>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">{children}</main>
    </div>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "px-3 py-1 rounded-md hover:bg-emerald-800 " + (isActive ? "bg-emerald-900" : "")
      }
    >
      {children}
    </NavLink>
  );
}
