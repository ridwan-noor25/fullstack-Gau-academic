// src/pages/hod/Units.jsx
import React, { useEffect, useState } from "react";
import {
  listUnits,
  listLecturers,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../utils/hodApi";

const YEARS = [1, 2, 3, 4];
const SEMS = [1, 2];

export default function HodUnits() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [units, setUnits] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  // create form
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [lecIds, setLecIds] = useState([]);

  // inline edit state
  const [editingUnitId, setEditingUnitId] = useState(null);
  const [editLecIds, setEditLecIds] = useState([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const [us, lecs] = await Promise.all([listUnits(), listLecturers()]);
        if (!alive) return;
        setUnits(us);
        setLecturers(lecs);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => (alive = false);
  }, []);

  const onToggleCreateLec = (id) =>
    setLecIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const onCreate = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!code || !title) {
        setErr("Code and title are required.");
        return;
      }
      if (!yearLevel || !semester) {
        setErr("Year level and semester are required.");
        return;
      }
      const payload = {
        code,
        title,
        year_level: Number(yearLevel),
        semester: Number(semester),
        lecturer_ids: lecIds,
      };
      await createUnit(payload);
      const [us, lecs] = await Promise.all([listUnits(), listLecturers()]);
      setUnits(us);
      setLecturers(lecs);
      setCode("");
      setTitle("");
      setCredits("");
      setYearLevel("");
      setSemester("");
      setLecIds([]);
    } catch (e) {
      setErr(e.message || "Failed to create unit.");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this unit?")) return;
    setErr("");
    try {
      await deleteUnit(id);
      setUnits((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message || "Failed to delete unit.");
    }
  };

  const startEdit = (u) => {
    setEditingUnitId(u.id);
    setEditLecIds((u.lecturers || []).map((x) => x.id));
  };
  const cancelEdit = () => {
    setEditingUnitId(null);
    setEditLecIds([]);
  };
  const onToggleEditLec = (id) =>
    setEditLecIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const saveEdit = async (u) => {
    setErr("");
    try {
      await updateUnit(u.id, { lecturer_ids: editLecIds });
      const us = await listUnits();
      setUnits(us);
      cancelEdit();
    } catch (e) {
      setErr(e.message || "Failed to update assignments.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Units</h1>
        <p className="text-sm text-gray-600">Create units and manage assigned lecturers.</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Create Unit */}
      <form onSubmit={onCreate} className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Create Unit</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="CHE 121"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Physical Chemistry I"
            />
          </div>
        

          <div>
            <label className="block text-sm font-medium text-gray-700">Year Level</label>
            <select
              value={yearLevel}
              onChange={(e) => setYearLevel(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select…</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select…</option>
              {SEMS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Assign Lecturers (optional)</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {lecturers.map((l) => (
                <label key={l.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={lecIds.includes(l.id)}
                    onChange={() => setLecIds((prev) => prev.includes(l.id) ? prev.filter(x => x !== l.id) : [...prev, l.id])}
                    className="h-4 w-4"
                  />
                  <span className="font-medium">{l.name}</span>
                  <span className="text-gray-600">— {l.email}</span>
                </label>
              ))}
              {lecturers.length === 0 && (
                <p className="text-sm text-gray-500">No lecturers in your department yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Create Unit
          </button>
        </div>
      </form>

      {/* List Units */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <Th>Code</Th>
              <Th>Title</Th>
              <Th>Year</Th>
              <Th>Sem</Th>
              <Th>Lecturers</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-600">Loading…</td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No units yet.</td>
              </tr>
            ) : (
              units.map((u) => (
                <tr key={u.id}>
                  <Td className="font-medium">{u.code}</Td>
                  <Td>{u.title}</Td>
                  <Td>{u.year_level ?? "—"}</Td>
                  <Td>{u.semester ?? "—"}</Td>
                  <Td className="text-sm">
                    {editingUnitId === u.id ? (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {lecturers.map((l) => (
                          <label key={l.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editLecIds.includes(l.id)}
                              onChange={() =>
                                setEditLecIds((prev) => prev.includes(l.id) ? prev.filter(x => x !== l.id) : [...prev, l.id])
                              }
                            />
                            <span>{l.name}</span>
                          </label>
                        ))}
                        {lecturers.length === 0 && <span className="text-gray-500">No lecturers</span>}
                      </div>
                    ) : (u.lecturers || []).length ? (
                      <div className="flex flex-wrap gap-1">
                        {u.lecturers.map((l) => (
                          <span key={l.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                            {l.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </Td>
                  <Td>
                    {editingUnitId === u.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(u)}
                          className="rounded-md bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(u)}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Manage
                        </button>
                        <button
                          onClick={() => onDelete(u.id)}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
