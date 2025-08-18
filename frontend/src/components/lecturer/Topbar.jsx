// src/components/lecturer/Topbar.jsx
import React from "react";

export default function Topbar({ onQuickAdd }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm md:hidden"
            onClick={() => alert("Sidebar is available on larger screens.")}
          >
            ☰
          </button>
          <div className="hidden text-sm text-gray-500 md:block">
            Term: <span className="font-medium text-gray-800">2025/2026 - Semester 1</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search student, course, reg no..."
            className="hidden w-80 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 md:block"
          />
          <button
            onClick={onQuickAdd}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + Quick Add
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-xl">👩🏽‍🏫</span>
            <span className="text-sm font-medium">You</span>
          </div>
        </div>
      </div>
    </header>
  );
}
