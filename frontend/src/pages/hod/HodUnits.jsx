// src/pages/hod/HodUnits.jsx
import React, { useEffect, useMemo, useState } from "react";
import { hodListUnits, hodListLecturers, hodPublishUnit } from "../../utils/hodApi";

export default function HodUnits() {
  const [units, setUnits] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [q, setQ] = useState("");

  async function refresh() {
    try {
      setErr("");
      const [us, ls] = await Promise.all([hodListUnits(), hodListLecturers()]);
      setUnits(us);
      setLecturers(ls);
    } catch (e) {
      setErr(e.message || "Failed to load.");
    }
  }

  useEffect(() => { refresh(); }, []);

  const assignedMap = useMemo(() => {
    const map = new Map(); // unitId -> [lecturer names]
    lecturers.forEach((l) => {
      (l.units || []).forEach((u) => {
        const list = map.get(u.id) || [];
        list.push(l.name);
        map.set(u.id, list);
      });
    });
    return map;
  }, [lecturers]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return units;
    return units.filter(
      (u) =>
        u.code?.toLowerCase().includes(term) ||
        u.title?.toLowerCase().includes(term)
    );
  }, [units, q]);

  async function publish(unitId) {
    if (!confirm("Publish all assessments for this unit?")) return;
    setBusyId(unitId);
    try {
      await hodPublishUnit(unitId);
      // Optionally show a toast; for now just refresh
      await refresh();
      alert("Published successfully.");
    } catch (e) {
      setErr(e.message || "Failed to publish.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Units & Publish</h1>
        <p className="text-sm text-gray-500 mt-1">
          View department units, see assigned lecturers, and publish grades by unit.
        </p>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <input
          placeholder="Search units (code/title)…"
          className="w-full rounded-xl border px-3 py-2"
          value={q} onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <Th>Code</Th>
                <Th>Title</Th>
                <Th>Assigned Lecturer(s)</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No units found.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const names = assignedMap.get(u.id) || [];
                  return (
                    <tr key={u.id} className="border-t">
                      <Td className="font-medium">{u.code}</Td>
                      <Td className="text-gray-800">{u.title}</Td>
                      <Td className="text-gray-900">{names.length ? names.join(", ") : "—"}</Td>
                      <Td className="text-right">
                        <button
                          onClick={() => publish(u.id)}
                          disabled={busyId === u.id}
                          className="inline-flex items-center rounded-xl bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800 disabled:opacity-60"
                          title="Publish all assessments for this unit"
                        >
                          {busyId === u.id ? "Publishing…" : "Publish"}
                        </button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
}
