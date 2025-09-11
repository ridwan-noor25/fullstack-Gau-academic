// src/pages/lecturers/UnitAssessments.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getUnitAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  publishUnitAssessments,
  getUnitStudents,
  getUnitGrades,
  upsertGradesBulk,
} from "../../utils/lecturerApi";

export default function UnitAssessments() {
  const { unitId } = useParams();

  const [items, setItems] = useState([]);                // assessments
  const [students, setStudents] = useState([]);          // normalized students [{id,name,reg_number}]
  const [gradesByAssessment, setGradesByAssessment] = useState({}); // {assId: { studentId: score }}

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ title: "", weight: "", max_score: 100, due_at: "" });

  // grade editor state
  const [editAss, setEditAss] = useState(null);
  const [scores, setScores] = useState({}); // student_id -> score (string/number)
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let on = true;
    async function load() {
      setLoading(true);
      setErr("");

      try {
        const [ass, studs, gradesPack] = await Promise.all([
          getUnitAssessments(unitId),
          getUnitStudents(unitId),
          getUnitGrades(unitId),
        ]);
        if (!on) return;

        // 1) Assessments
        setItems(Array.isArray(ass) ? ass : []);

        // 2) Tolerant student normalization (Option A)
        // Accept either [{ student: {...} }] OR [{...}] and normalize to {id, name, reg_number}
        const normalizedStudents = (Array.isArray(studs) ? studs : [])
          .map((e) => (e && typeof e === "object" && "student" in e ? e.student : e))
          .filter(Boolean)
          .map((s) => ({
            id: s.id,
            name: s.name || "Unnamed",
            reg_number: s.reg_number || "",
          }));
        setStudents(normalizedStudents);

        // 3) Build grades map: { assessmentId: { studentId: score } }
        const map = {};
        (Array.isArray(gradesPack) ? gradesPack : []).forEach(({ assessment, grades }) => {
          if (!assessment || !assessment.id) return;
          const aid = assessment.id;
          map[aid] = {};
          (Array.isArray(grades) ? grades : []).forEach((g) => {
            if (g && g.student_id != null) {
              map[aid][g.student_id] = g.score;
            }
          });
        });
        setGradesByAssessment(map);
      } catch (e) {
        if (on) setErr(e.message || "Failed to load assessments");
      } finally {
        if (on) setLoading(false);
      }
    }
    load();
    return () => {
      on = false;
    };
  }, [unitId]);

  const totalWeight = useMemo(
    () => (Array.isArray(items) ? items.reduce((acc, x) => acc + (Number(x.weight) || 0), 0) : 0),
    [items]
  );

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    const payload = {
      title: String(form.title || "").trim(),
      weight: Number(form.weight || 0),
      max_score: Number(form.max_score || 100),
      due_at: form.due_at || null,
    };
    try {
      const created = await createAssessment(unitId, payload);
      setItems((prev) => [...prev, created]);
      setForm({ title: "", weight: "", max_score: 100, due_at: "" });
    } catch (e) {
      setErr(e.message || "Failed to create assessment");
    }
  }

  async function onUpdate(a, patch) {
    setErr("");
    try {
      const upd = await updateAssessment(a.id, patch);
      setItems((prev) => prev.map((x) => (x.id === a.id ? upd : x)));
    } catch (e) {
      setErr(e.message || "Failed to update");
    }
  }

  async function onDelete(a) {
    if (!confirm(`Delete ${a.title}?`)) return;
    setErr("");
    try {
      await deleteAssessment(a.id);
      setItems((prev) => prev.filter((x) => x.id !== a.id));
    } catch (e) {
      setErr(e.message || "Failed to delete");
    }
  }

  async function onPublishAll() {
    setErr("");
    try {
      await publishUnitAssessments(unitId);
      setItems((prev) => prev.map((x) => ({ ...x, is_published: true })));
    } catch (e) {
      setErr(e.message || "Failed to publish");
    }
  }

  function openGrades(a) {
    if (!a || !a.id) return;
    setEditAss(a);

    // start with existing grades for this assessment (if any)
    const preset = { ...(gradesByAssessment[a.id] || {}) };

    // ensure every enrolled student has a key
    (students || []).forEach((s) => {
      if (s && s.id != null && preset[s.id] == null) preset[s.id] = "";
    });

    setScores(preset);
  }

  async function saveGrades() {
    if (!editAss) return;
    setSaving(true);
    setErr("");
    try {
      const rows = Object.entries(scores)
        .map(([sid, val]) => ({
          student_id: Number(sid),
          score: val === "" ? 0 : Number(val),
        }))
        .filter((r) => !Number.isNaN(r.student_id) && !Number.isNaN(r.score));

      await upsertGradesBulk(editAss.id, rows);

      // refresh grade map
      const pack = await getUnitGrades(unitId);
      const map = {};
      (Array.isArray(pack) ? pack : []).forEach(({ assessment, grades }) => {
        if (!assessment || !assessment.id) return;
        const aid = assessment.id;
        map[aid] = {};
        (Array.isArray(grades) ? grades : []).forEach((g) => {
          if (g && g.student_id != null) {
            map[aid][g.student_id] = g.score;
          }
        });
      });
      setGradesByAssessment(map);
      setEditAss(null);
    } catch (e) {
      setErr(e.message || "Failed to save grades");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Assessments — Unit #{unitId}</h2>
        <div className="flex items-center gap-2">
          <Link
            to={`/lecturer/units`}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Back
          </Link>
          <button
            onClick={onPublishAll}
            className="text-sm px-3 py-1.5 rounded-md border border-green-700 text-green-700 hover:bg-gray-50"
          >
            Publish All
          </button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_20rem] gap-6">
        {/* List */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <Th>Title</Th>
                <Th>Weight (%)</Th>
                <Th>Max</Th>
                <Th>Due</Th>
                <Th>Published</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-5 py-6 text-center text-gray-500">
                    No assessments yet.
                  </td>
                </tr>
              )}
              {items.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <Td className="font-medium">{a.title}</Td>
                  <Td>{a.weight ?? 0}</Td>
                  <Td>{a.max_score ?? 100}</Td>
                  <Td>{a.due_at ? new Date(a.due_at).toLocaleString() : "—"}</Td>
                  <Td>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        a.is_published ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {a.is_published ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openGrades(a)}
                        className="text-xs px-3 py-1.5 rounded-md border border-green-700 text-green-700 hover:bg-gray-50"
                      >
                        Enter Grades
                      </button>
                      <button
                        onClick={() => onUpdate(a, { is_published: !a.is_published })}
                        className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {a.is_published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => onDelete(a)}
                        className="text-xs px-3 py-1.5 rounded-md border border-red-700 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {items.length > 0 && (
                <tr className="bg-gray-50">
                  <Td className="font-semibold">Total Weight</Td>
                  <Td className="font-semibold">{totalWeight}</Td>
                  <Td colSpan="4" />
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Create / Edit form */}
        <aside className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Add Assessment</h3>
          <form className="mt-3 grid gap-3" onSubmit={onCreate}>
            <div>
              <label className="block text-xs text-gray-600">Title</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="CAT 1"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600">Weight (%)</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                  value={form.weight}
                  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Max Score</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                  value={form.max_score}
                  onChange={(e) => setForm((f) => ({ ...f, max_score: e.target.value }))}
                  min="1"
                  step="1"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600">Due (ISO 8601, optional)</label>
              <input
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:ring-green-600 focus:border-green-600"
                value={form.due_at}
                onChange={(e) => setForm((f) => ({ ...f, due_at: e.target.value }))}
                placeholder="2025-09-03T12:00:00"
              />
            </div>
            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center rounded-md bg-green-700 text-white px-4 py-2 hover:bg-green-800"
            >
              Create
            </button>
          </form>
        </aside>
      </div>

      {/* Grade editor drawer */}
      {editAss && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditAss(null)} />
          <div className="absolute top-0 right-0 h-full w-full md:w-[40rem] bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Enter Grades — {editAss.title} (Max {editAss.max_score})
              </h3>
              <button onClick={() => setEditAss(null)} className="text-gray-600 hover:underline">
                Close
              </button>
            </div>

            <div className="mt-4">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Student</Th>
                    <Th>Reg No</Th>
                    <Th>Score</Th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(students || []).map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <Td className="font-medium">{s.name}</Td>
                      <Td>{s.reg_number || "—"}</Td>
                      <Td>
                        <input
                          type="number"
                          className="w-28 rounded-md border border-gray-300 p-1 focus:ring-green-600 focus:border-green-600"
                          value={scores[s.id] ?? ""}
                          min="0"
                          max={editAss.max_score ?? 100}
                          step="0.5"
                          onChange={(e) =>
                            setScores((prev) => ({ ...prev, [s.id]: e.target.value }))
                          }
                        />
                      </Td>
                    </tr>
                  ))}
                  {(students || []).length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-5 py-6 text-center text-gray-500">
                        No enrolled students.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={saveGrades}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-green-700 text-white px-4 py-2 hover:bg-green-800 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Grades"}
                </button>
                <button
                  onClick={() => setEditAss(null)}
                  className="inline-flex items-center rounded-md border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

              {err && (
                <div className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {err}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 ${className}`}>{children}</td>;
}
