import React from "react";

// Default export — import WITHOUT braces
export default function StatCard({ title, value, subtext, icon: Icon }) {
  return (
    <div className="rounded-2xl border p-4 flex items-center gap-4">
      {Icon && <Icon className="w-8 h-8 text-green-700" />}
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
      </div>
    </div>
  );
}
