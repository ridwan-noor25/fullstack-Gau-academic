// import React, { useState } from 'react'
// import { api } from '../../api'
// import RequireAuth from '../../components/RequireAuth'


// function GradesInner(){
// const [assessment_id, setAssessmentId] = useState('')
// const [student_id, setStudentId] = useState('')
// const [score, setScore] = useState('')
// const [msg, setMsg] = useState('')
// const [err, setErr] = useState('')


// async function upsert(e){
// e.preventDefault(); setErr(''); setMsg('')
// try{
// const res = await api.request('/grades', { method:'POST', body:{ assessment_id: Number(assessment_id), student_id: Number(student_id), score: Number(score) } })
// setMsg(`Saved grade ${res.id} (status ${res.status})`)
// }catch(e){ setErr(String(e.message||e)) }
// }


// async function submitAll(){
// setErr(''); setMsg('')
// try{
// const res = await api.request('/grades/submit', { method:'POST', body:{ assessment_id: Number(assessment_id) } })
// setMsg(`Submitted ${res.updated} grades`)
// }catch(e){ setErr(String(e.message||e)) }
// }


// return (
// <div style={{padding:16}}>
// <h3>Enter Grades</h3>
// {err && <p style={{color:'crimson'}}>{err}</p>}
// {msg && <p style={{color:'green'}}>{msg}</p>}
// <form onSubmit={upsert}>
// <input placeholder="Assessment ID" value={assessment_id} onChange={e=>setAssessmentId(e.target.value)} required />{' '}
// <input placeholder="Student ID" value={student_id} onChange={e=>setStudentId(e.target.value)} required />{' '}
// <input type="number" placeholder="Score" value={score} onChange={e=>setScore(e.target.value)} required />{' '}
// <button type="submit">Save</button>
// </form>
// <button style={{marginTop:12}} onClick={submitAll}>Submit All for Assessment</button>
// </div>
// )
// }


// export default function Grades(){
// return (
// <RequireAuth roles={["lecturer"]}>
// <GradesInner/>
// </RequireAuth>
// )
// }



import React, { useEffect, useState } from "react";

/** ==== Config (env-driven, no hardcoding) ==== */
const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const MY_GRADES_URL = import.meta.env.VITE_MY_GRADES_URL || "/api/my/grades";

/** ==== Helpers ==== */
const buildUrl = (u) => (u?.startsWith("http") ? u : `${API_BASE}${u || ""}`);
const authHeaders = () => {
  const h = { Accept: "application/json" };
  const tok = localStorage.getItem("token");
  if (tok) h.Authorization = `Bearer ${tok}`;
  return h;
};

function normalizeGrade(g) {
  if (!g || typeof g !== "object") return null;
  const n = (v, d = 0) => (typeof v === "number" ? v : Number(v ?? d) || d);
  return {
    unit:
      g.unit ||
      g.unit_code ||
      g.course_code ||
      g.course ||
      g.code ||
      g.name ||
      "—",
    assessment: g.assessment || g.assessment_type || g.type || "—",
    weight: n(g.weight ?? g.weighting, 0),
    max: n(g.max ?? g.max_score ?? 100, 100),
    score: n(g.score ?? g.marks ?? g.percentage, 0),
    status:
      g.status ||
      g.status_text ||
      (typeof g.published === "boolean"
        ? g.published
          ? "Published"
          : "Pending"
        : "—"),
  };
}

export default function MyGrades() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr("");
      try {
        if (!API_BASE || !MY_GRADES_URL) {
          // Graceful empty state if env not configured
          setRows([]);
        } else {
          const res = await fetch(buildUrl(MY_GRADES_URL), {
            headers: authHeaders(),
            credentials: "include",
          });
          if (res.status === 401) {
            throw new Error(
              "Your session has expired. Please login again to view grades."
            );
          }
          if (!res.ok) {
            throw new Error(`Failed to load grades (HTTP ${res.status}).`);
          }
          const j = await res.json();
          const arr = Array.isArray(j)
            ? j
            : Array.isArray(j?.data)
            ? j.data
            : Array.isArray(j?.items)
            ? j.items
            : Array.isArray(j?.results)
            ? j.results
            : [];
          const normalized = arr.map(normalizeGrade).filter(Boolean);
          if (alive) setRows(normalized);
        }
      } catch (e) {
        if (alive) {
          setErr(e.message || "Failed to load grades.");
          setRows([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);

  const onPrint = () => window.print();

  return (
    <>
      {/* Print styles to hide the toolbar when printing */}
      <style>{`
        @media print {
          #grades-toolbar { display: none; }
          .print-container { box-shadow: none !important; border: none !important; }
          body { background: #fff; }
        }
      `}</style>

      {/* Toolbar */}
      <div
        id="grades-toolbar"
        className="mb-4 flex items-center justify-between gap-3"
      >
        <h1 className="text-xl font-semibold text-gray-900">My Grades</h1>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
            title="Print or Save as PDF"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="print-container overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Loading */}
        {loading && (
          <div className="px-6 py-16 text-center text-gray-600">
            Loading grades…
          </div>
        )}

        {/* Error */}
        {!loading && err && (
          <div className="px-6 py-8">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !err && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Unit</Th>
                  <Th>Assessment</Th>
                  <Th>Weight</Th>
                  <Th>Max</Th>
                  <Th>Score</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-6 text-center text-sm text-gray-500"
                    >
                      No grades available.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={`${r.unit}-${r.assessment}-${i}`} className="hover:bg-gray-50">
                      <Td className="font-medium">{r.unit}</Td>
                      <Td>{r.assessment}</Td>
                      <Td className="whitespace-nowrap">{r.weight}%</Td>
                      <Td className="whitespace-nowrap">{r.max}</Td>
                      <Td className="whitespace-nowrap">
                        {typeof r.score === "number" ? r.score : String(r.score)}
                      </Td>
                      <Td>
                        <Status s={r.status} />
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subtle hint (only if API disabled) */}
      {!loading && !err && !API_BASE && (
        <p className="mt-3 text-xs text-gray-500">
          Tip: set <code>VITE_API_BASE</code> and <code>VITE_MY_GRADES_URL</code> in your
          <code>.env</code> to fetch real grades.
        </p>
      )}
    </>
  );
}

/** Small table helpers */
function Th({ children }) {
  return (
    <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
function Status({ s }) {
  const tone =
    (s || "").toLowerCase() === "published"
      ? "bg-emerald-50 text-emerald-800"
      : (s || "").toLowerCase() === "pending"
      ? "bg-amber-50 text-amber-800"
      : "bg-gray-100 text-gray-800";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${tone}`}>{s || "—"}</span>;
}
