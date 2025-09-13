// src/components/lecturer/StatsCard.jsx
import React from "react";

export default function StatsCard({ label, value, hint, icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gray-100 p-3 text-xl">{icon}</div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-gray-400">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
