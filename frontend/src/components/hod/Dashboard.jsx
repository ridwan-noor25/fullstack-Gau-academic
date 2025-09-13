// src/pages/hod/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import HodLayout from "../../components/hod/Layout";
import StatsCard from "../../components/hod/StatsCard";
import { loadReports } from "../../utils/reports";
import { Link } from "react-router-dom";

const DEPTS = ["All", "Mathematics", "Chemistry", "Education", "Physics", "Computer Science", "English", "Unknown"];

export default function HodDashboard() {
  const [dept, setDept] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadReports());
    const onStorage = () => setItems(loadReports());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    return dept === "All" ? items : items.filter((x) => x.dept === dept);
  }, [items, dept]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const pending = filtered.filter((x) => x.status === "Pending").length;
    const seen = filtered.filter((x) => x.status === "Seen").length;
    const resolved = filtered.filter((x) => x.status === "Resolved").length;
    return { total, pending, seen, resolved };
  }, [filtered]);

  const recent = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5),
    [filtered]
  );

  return (
    <HodLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">HOD Dashboard</h1>
        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
          className="rounded-xl border px-3 py-2 bg-white"
          title="Filter by department (derived from course code prefix)"
        >
          {DEPTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Reports" value={stats.total} />
        <StatsCard label="Pending" value={stats.pending} />
        <StatsCard label="Seen" value={stats.seen} />
        <StatsCard label="Resolved" value={stats.resolved} />
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Reports</h2>
          <Link to="/hod/reports" className="text-sm underline">View all</Link>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <Th>ID</Th>
                <Th>Course</Th>
                <Th>Assessment</Th>
                <Th>Dept</Th>
                <Th>Submitted</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-gray-500">No reports yet.</td>
                </tr>
              ) : (
                recent.map((r) => (
                  <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-t">
                    <Td className="font-mono">{r.id}</Td>
                    <Td>{r.course}</Td>
                    <Td>{r.assessment}</Td>
                    <Td>{r.dept}</Td>
                    <Td>{new Date(r.submittedAt).toLocaleString()}</Td>
                    <Td><StatusBadge s={r.status} /></Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </HodLayout>
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 border-b text-sm text-gray-600">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={"px-3 py-2 " + className}>{children}</td>;
}
function StatusBadge({ s }) {
  const cls =
    s === "Resolved"
      ? "bg-emerald-100 text-emerald-800"
      : s === "Seen"
      ? "bg-amber-100 text-amber-800"
      : "bg-gray-200 text-gray-800";
  return <span className={"text-xs px-2 py-1 rounded-full " + cls}>{s}</span>;
}
