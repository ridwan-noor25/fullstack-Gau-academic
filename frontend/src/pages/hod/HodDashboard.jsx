// src/pages/hod/HodDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { hodListLecturers, hodListUnits } from "../../utils/hodApi";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-xs sm:text-sm text-gray-500 font-medium">{label}</div>
      <div className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function HodDashboard() {
  const [lecturers, setLecturers] = useState([]);
  const [units, setUnits] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const [ls, us] = await Promise.all([hodListLecturers(), hodListUnits()]);
        setLecturers(ls);
        setUnits(us);
      } catch (e) {
        setErr(e.message || "Failed to load.");
      }
    })();
  }, []);

  const assignedPairs = useMemo(() => {
    const s = new Set();
    lecturers.forEach((l) => (l.units || []).forEach((u) => s.add(`${l.id}:${u.id}`)));
    return s.size;
  }, [lecturers]);

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">HoD Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Quick snapshot of your department.
        </p>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Stat label="Lecturers" value={lecturers.length} />
        <Stat label="Units" value={units.length} />
        <Stat label="Assignments (Lecturer ↔ Unit)" value={assignedPairs} />
      </div>

      {/* Table Section - Takes remaining space */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">At a Glance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <Th>Lecturer</Th>
                <Th>Email</Th>
                <Th>Units</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(lecturers || []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No lecturers yet.
                  </td>
                </tr>
              ) : (
                lecturers.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <Td className="font-medium text-gray-900">{l.name}</Td>
                    <Td className="text-gray-600">{l.email}</Td>
                    <Td className="text-gray-900">
                      {(l.units || []).length === 0
                        ? "—"
                        : l.units.map((u) => u.code).join(", ")}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 bg-gray-50">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 text-sm ${className}`}>{children}</td>;
}
