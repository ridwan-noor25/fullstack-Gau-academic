// src/pages/hod/Curriculum.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HodLayout from "../../components/hod/Layout";
import {
  listPrograms,
  getProgramSlice,
  setProgramSlice,
  listUnits,
} from "../../utils/hodApi";

export default function Curriculum() {
  const [params, setParams] = useSearchParams();
  const initialProgram = Number(params.get("program")) || null;

  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState(initialProgram);
  const [year, setYear] = useState(Number(params.get("year")) || 1);
  const [semester, setSemester] = useState(Number(params.get("semester")) || 1);

  const [allUnits, setAllUnits] = useState([]);
  const [selected, setSelected] = useState([]); // unit_ids
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const currentProg = useMemo(() => programs.find((p) => p.id === programId) || null, [programs, programId]);
  const maxYears = currentProg?.duration_years || 4;

  useEffect(() => {
    let on = true;
    async function boot() {
      setLoading(true);
      setErr("");
      try {
        const [ps] = await Promise.all([listPrograms()]);
        if (!on) return;
        setPrograms(ps);
        // pick first program if none
        const pid = initialProgram || ps[0]?.id || null;
        setProgramId(pid);
      } catch (e) {
        if (on) setErr(e.message || "Failed to load programs.");
      } finally {
        if (on) setLoading(false);
      }
    }
    boot();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!programId) return;
    let on = true;
    async function loadSlice() {
      setLoading(true);
      setErr("");
      try {
        const { allUnits: units, unitIds } = await getProgramSlice(programId, { year, semester });
        if (!on) return;
        setAllUnits(units);
        setSelected(unitIds);
        // reflect in URL (nice UX)
        const p = new URLSearchParams(params);
        p.set("program", String(programId));
        p.set("year", String(year));
        p.set("semester", String(semester));
        setParams(p, { replace: true });
      } catch (e) {
        if (on) setErr(e.message || "Failed to load curriculum.");
      } finally {
        if (on) setLoading(false);
      }
    }
    loadSlice();
    // eslint-disable-next-line
  }, [programId, year, semester]);

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  async function save() {
    if (!programId) return;
    setErr("");
    setLoading(true);
    try {
      await setProgramSlice(programId, { year, semester, unit_ids: selected });
    } catch (e) {
      setErr(e.message || "Failed to save curriculum.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <HodLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Curriculum</h1>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Program picker */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Program</label>
          <select
            className="mt-1 w-full rounded-lg border px-3 py-2"
            value={programId || ""}
            onChange={(e) => setProgramId(Number(e.target.value) || null)}
          >
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
            {programs.length === 0 && <option value="">No programs</option>}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || 1)}
              >
                {Array.from({ length: maxYears }, (_, i) => i + 1).map((y) => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value) || 1)}
              >
                <option value={1}>Semester 1</option>
                <option value={2}>Semester 2</option>
              </select>
            </div>
          </div>

          <button
            onClick={save}
            disabled={loading || !programId}
            className="mt-4 inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save Slice"}
          </button>
        </div>

        {/* Unit selector */}
        <div className="sm:col-span-2 rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">
              Units — {currentProg ? `${currentProg.code} • Year ${year} • Sem ${semester}` : "—"}
            </h2>
            <span className="text-sm text-gray-500">{selected.length} selected</span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-600">Loading…</div>
          ) : allUnits.length === 0 ? (
            <div className="py-10 text-center text-gray-600">No units found in your department.</div>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {allUnits.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={selected.includes(u.id)}
                    onChange={() => toggle(u.id)}
                  />
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.code} — {u.title}</div>
                    {u.credits != null && (
                      <div className="text-xs text-gray-500">Credits: {u.credits}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </HodLayout>
  );
}
