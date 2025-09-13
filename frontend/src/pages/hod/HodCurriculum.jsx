// src/pages/hod/HodCurriculum.jsx
import React, { useEffect, useState } from "react";
import { listPrograms, listUnits, listCurriculum, addCurriculumRow, deleteCurriculumRow } from "../../utils/hodApi";

export default function HodCurriculum() {
  const [programs, setPrograms] = useState([]);
  const [units, setUnits] = useState([]);
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({ unit_id: "", year_number: 1, semester_number: 1, is_core: true });

  useEffect(() => {
    (async () => {
      try {
        const [ps, us] = await Promise.all([listPrograms(), listUnits()]);
        setPrograms(ps);
        setUnits(us);
        if (ps[0]) setPid(String(ps[0].id));
      } catch (e) {
        setErr(e.message || "Failed to load.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!pid) return;
    (async () => {
      try {
        setErr("");
        const r = await listCurriculum(pid);
        setRows(r);
      } catch (e) {
        setErr(e.message || "Failed to load curriculum.");
      }
    })();
  }, [pid]);

  async function onAdd(e) {
    e.preventDefault();
    try {
      setErr("");
      if (!form.unit_id) return;
      await addCurriculumRow(Number(pid), {
        unit_id: Number(form.unit_id),
        year_number: Number(form.year_number),
        semester_number: Number(form.semester_number),
        is_core: !!form.is_core,
      });
      const r = await listCurriculum(pid);
      setRows(r);
      setForm({ unit_id: "", year_number: 1, semester_number: 1, is_core: true });
    } catch (e) {
      setErr(e.message || "Failed to add row.");
    }
  }

  async function onDeleteRow(rowId) {
    if (!confirm("Remove this mapping?")) return;
    try {
      setErr("");
      await deleteCurriculumRow(Number(pid), rowId);
      setRows((prev) => prev.filter((x) => x.id !== rowId));
    } catch (e) {
      setErr(e.message || "Failed to delete row.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Curriculum</h1>
        <select value={pid} onChange={(e) => setPid(e.target.value)} className="rounded-lg border px-3 py-2">
          {programs.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
        </select>
      </header>

      {err && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}

      <form onSubmit={onAdd} className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Add Mapping</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Unit</label>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.unit_id}
              onChange={(e) => setForm((f) => ({ ...f, unit_id: e.target.value }))}
            >
              <option value="">Select unit…</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.code} — {u.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input type="number" min="1" className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.year_number} onChange={(e) => setForm((f) => ({ ...f, year_number: e.target.value }))}/>
          </div>
          <div>
            <label className="block text-sm font-medium">Semester</label>
            <input type="number" min="1" className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.semester_number} onChange={(e) => setForm((f) => ({ ...f, semester_number: e.target.value }))}/>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_core} onChange={(e) => setForm((f) => ({ ...f, is_core: e.target.checked }))}/>
            <span className="text-sm">Core</span>
          </label>
        </div>
        <div className="mt-4">
          <button className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800">Add</button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <Th>Year</Th><Th>Sem</Th><Th>Unit</Th><Th>Core</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No mappings.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id}>
                <Td>{r.year_number}</Td>
                <Td>{r.semester_number}</Td>
                <Td>{r.unit ? `${r.unit.code} — ${r.unit.title}` : r.unit_id}</Td>
                <Td>{r.is_core ? "Yes" : "No"}</Td>
                <Td>
                  <button onClick={() => onDeleteRow(r.id)} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
                    Remove
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) { return <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600">{children}</th>; }
function Td({ children, className="" }) { return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>; }
