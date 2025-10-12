// src/pages/students/EnrollUnits.jsx
import React, { useEffect, useMemo, useState } from "react";
import { getAvailableUnits, enrollUnit, getMyEnrollments } from "../../utils/studentApi";

export default function EnrollUnits() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [units, setUnits] = useState([]);
  const [my, setMy] = useState([]);

  // filters
  const [yearLevel, setYearLevel] = useState("");
  const [semester, setSemester] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      // always fetch my enrollments so the side panel is correct
      const myEnrolls = await getMyEnrollments();
      setMy(Array.isArray(myEnrolls) ? myEnrolls : []);

      // fetch units only if both filters selected
      let u = [];
      if (yearLevel && semester) {
        u = await getAvailableUnits({
          yearLevel,
          semester,
        });
      }
      setUnits(Array.isArray(u) ? u : []);
    } catch (e) {
      setErr(e.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // initial

  async function applyFilters(e) {
    e?.preventDefault?.();
    await load();
  }

  async function onEnroll(unitId) {
    setErr("");
    try {
      await enrollUnit(unitId);
      await load();
    } catch (e) {
      setErr(e.message || "Failed to enroll.");
    }
  }

  const myUnitIds = useMemo(() => new Set((my || []).map((r) => r.unit_id)), [my]);

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-6">
      <section>
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Enroll Units</h1>
          <p className="text-sm text-gray-600">Pick your units for this term.</p>
        </header>

        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={applyFilters} className="mb-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-600">Year Level</label>
            <select
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="mt-1 rounded-lg border px-3 py-2"
            >
              <option value="">Select…</option>
              {[1,2,3,4].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 rounded-lg border px-3 py-2"
            >
              <option value="">Select…</option>
              {[1,2].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Apply
          </button>
        </form>

        {!yearLevel || !semester ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Choose <b>Year Level</b> and <b>Semester</b> then click <em>Apply</em> to see available units.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Code</Th>
                  <Th>Title</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-600">Loading…</td>
                  </tr>
                ) : (units.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-gray-500">No units available.</td>
                  </tr>
                ) : (
                  units.map((u) => {
                    const already = myUnitIds.has(u.id);
                    return (
                      <tr key={u.id}>
                        <Td className="font-medium">{u.code}</Td>
                        <Td>{u.title}</Td>
                        <Td className="text-right">
                          <button
                            onClick={() => onEnroll(u.id)}
                            disabled={already}
                            className={`rounded-lg px-3 py-1.5 text-sm border ${
                              already
                                ? "text-gray-500 border-gray-200 cursor-not-allowed"
                                : "text-green-700 border-green-700 hover:bg-green-50"
                            }`}
                          >
                            {already ? "Enrolled" : "Enroll"}
                          </button>
                        </Td>
                      </tr>
                    );
                  })
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <aside>
        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900">My Enrollments</h3>
          <div className="mt-3 space-y-2 max-h-[28rem] overflow-y-auto pr-1">
            {(my || []).length === 0 ? (
              <p className="text-sm text-gray-500">No enrollments yet.</p>
            ) : (
              my.map((r) => (
                <div key={r.id} className="rounded-lg border px-3 py-2">
                  <div className="text-sm font-medium">
                    {r.unit?.code || "UNIT"} — {r.unit?.title || ""}
                  </div>
                  <div className="text-xs text-gray-500">ID: {r.unit_id}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
