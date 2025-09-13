// src/pages/hod/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import HodLayout from "../../components/hod/Layout";
import { deleteReport, loadReports, saveReports, updateReport } from "../../utils/reports";

const STATUS = ["All", "Pending", "Seen", "Resolved"];
const DEPTS = ["All", "Mathematics", "Chemistry", "Education", "Physics", "Computer Science", "English", "Unknown"];

export default function HodReports() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [dept, setDept] = useState("All");
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadReports());
    const onStorage = () => setItems(loadReports());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((x) => {
      const matchesQ =
        x.id.toLowerCase().includes(q) ||
        (x.course || "").toLowerCase().includes(q) ||
        (x.assessment || "").toLowerCase().includes(q) ||
        (x.message || "").toLowerCase().includes(q) ||
        (x.hodNote || "").toLowerCase().includes(q) ||
        (x.status || "").toLowerCase().includes(q);
      const matchesS = status === "All" ? true : x.status === status;
      const matchesD = dept === "All" ? true : (x.dept === dept);
      return matchesQ && matchesS && matchesD;
    });
  }, [items, query, status, dept]);

  function setStatusFor(id, next) {
    const updated = updateReport(id, (r) => ({ ...r, status: next }));
    setItems(updated);
  }

  function setNoteFor(id) {
    const current = items.find((r) => r.id === id);
    const initial = current?.hodNote || "";
    const note = window.prompt("Add/Edit HOD note (visible to staff only):", initial);
    if (note === null) return; // cancel
    const updated = updateReport(id, (r) => ({ ...r, hodNote: note }));
    setItems(updated);
  }

  function remove(id) {
    if (!window.confirm("Delete this report? This cannot be undone.")) return;
    const updated = deleteReport(id);
    setItems(updated);
  }

  function exportCSV() {
    const rows = [
      ["ID", "Course", "Assessment", "Dept", "Expected", "SubmittedAt", "Status", "ProofURL", "HOD Note", "Student Message"],
      ...filtered.map((r) => [
        r.id,
        r.course,
        r.assessment,
        r.dept,
        r.expected ?? "",
        r.submittedAt,
        r.status,
        r.proofUrl ?? "",
        r.hodNote ?? "",
        (r.message || "").replace(/\s+/g, " ").trim(),
      ]),
    ];
    const csv = rows.map((arr) => arr.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hod_reports_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (!window.confirm("Danger: clear ALL reports from storage?")) return;
    saveReports([]);
    setItems(loadReports());
  }

  return (
    <HodLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold">Reports</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search… (ID, course, assessment, message, status)"
            className="rounded-xl border px-3 py-2 bg-white w-64"
          />
          <select value={dept} onChange={(e) => setDept(e.target.value)} className="rounded-xl border px-3 py-2 bg-white">
            {DEPTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border px-3 py-2 bg-white">
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button onClick={exportCSV} className="rounded-xl px-3 py-2 border bg-white hover:bg-gray-50">Export CSV</button>
          <button onClick={clearAll} className="rounded-xl px-3 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50">
            Clear All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <Th>ID</Th>
              <Th>Course</Th>
              <Th>Assessment</Th>
              <Th>Dept</Th>
              <Th>Expected</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
              <Th>Proof</Th>
              <Th>HOD Note</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-3 py-6 text-center text-gray-500">No matching reports.</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50 border-t align-top">
                  <Td className="font-mono">{r.id}</Td>
                  <Td>
                    <div className="font-medium">{r.course}</div>
                    <div className="text-xs text-gray-500">{(r.message || "").slice(0, 90)}{(r.message || "").length > 90 ? "…" : ""}</div>
                  </Td>
                  <Td>{r.assessment}</Td>
                  <Td>{r.dept}</Td>
                  <Td>{r.expected ?? "—"}</Td>
                  <Td className="whitespace-nowrap">{new Date(r.submittedAt).toLocaleString()}</Td>
                  <Td><StatusBadge s={r.status} /></Td>
                  <Td>
                    {r.proofUrl ? (
                      <a href={r.proofUrl} target="_blank" rel="noreferrer" className="text-sm underline">Open</a>
                    ) : "—"}
                  </Td>
                  <Td>
                    <div className="text-sm whitespace-pre-wrap">{r.hodNote || <span className="text-gray-400">—</span>}</div>
                  </Td>
                  <Td>
                    <div className="flex flex-col gap-1">
                      {r.status !== "Seen" && (
                        <Button onClick={() => setStatusFor(r.id, "Seen")}>Mark Seen</Button>
                      )}
                      {r.status !== "Resolved" && (
                        <Button onClick={() => setStatusFor(r.id, "Resolved")}>Resolve</Button>
                      )}
                      {r.status !== "Pending" && (
                        <Button onClick={() => setStatusFor(r.id, "Pending")}>Reopen</Button>
                      )}
                      <Button onClick={() => setNoteFor(r.id)}>Add/Edit Note</Button>
                      <Danger onClick={() => remove(r.id)}>Delete</Danger>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </HodLayout>
  );
}

function Th({ children }) {
  return <th className="px-3 py-2 border-b text-sm text-gray-600">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={"px-3 py-2 " + className}>{children}</td>;
}
function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-sm rounded-lg px-2 py-1 border bg-white hover:bg-gray-50"
    >
      {children}
    </button>
  );
}
function Danger({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-sm rounded-lg px-2 py-1 border border-red-300 text-red-700 bg-white hover:bg-red-50"
    >
      {children}
    </button>
  );
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
