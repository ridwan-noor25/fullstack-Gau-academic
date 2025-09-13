// src/pages/lecturers/Gradebook.jsx
import React, { useMemo, useState } from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import Table from "../../components/lecturer/Table";
import Modal from "../../components/lecturer/Modal";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function Gradebook() {
  const [store, setStore] = useLocalStorage("gau-lecturer", {
    gradebook: [
      { reg: "GU/ED/1234/23", name: "Ali Hussein", cat: 18, final: 56 },
      { reg: "GU/ED/1260/23", name: "Fatuma Noor", cat: 22, final: 45 },
      { reg: "GU/ED/1320/23", name: "Abdi Ahmed", cat: 25, final: 30 },
    ],
  });
  const [openPolicy, setOpenPolicy] = useState(false);
  const [newRow, setNewRow] = useState({ reg: "", name: "", cat: 0, final: 0 });

  const rows = useMemo(() => {
    const gb = store.gradebook || [];
    return gb.map((r) => {
      const cat = clamp(r.cat, 30);
      const final = clamp(r.final, 70);
      const total = safeNum(cat) + safeNum(final);
      const grade = getGrade(total);
      return { ...r, cat, final, total, grade };
    });
  }, [store]);

  function updateCell(reg, key, rawValue) {
    const max = key === "cat" ? 30 : 70;
    const value = clamp(rawValue, max);
    setStore((prev) => ({
      ...prev,
      gradebook: (prev.gradebook || []).map((r) =>
        r.reg === reg ? { ...r, [key]: value } : r
      ),
    }));
  }

  function addStudent() {
    if (!newRow.reg.trim() || !newRow.name.trim()) return;
    setStore((prev) => ({
      ...prev,
      gradebook: [
        ...(prev.gradebook || []),
        {
          reg: newRow.reg.trim(),
          name: newRow.name.trim(),
          cat: clamp(newRow.cat, 30),
          final: clamp(newRow.final, 70),
        },
      ],
    }));
    setNewRow({ reg: "", name: "", cat: 0, final: 0 });
  }

  function removeStudent(reg) {
    setStore((prev) => ({
      ...prev,
      gradebook: (prev.gradebook || []).filter((r) => r.reg !== reg),
    }));
  }

  function exportCSV() {
    const headers = ["Reg No", "Name", "CAT(30)", "Final(70)", "Total(100)", "Grade"];
    const lines = rows.map((r) => [r.reg, r.name, r.cat, r.final, r.total, r.grade].join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gradebook.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <LecturerLayout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Gradebook</h1>
          {/* No inline scale text; open modal for policy */}
          <button
            onClick={() => setOpenPolicy(true)}
            className="mt-1 inline-flex items-center gap-2 text-sm text-emerald-700 hover:underline"
          >
            ℹ️ Grading Policy
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
            onClick={exportCSV}
          >
            Export CSV
          </button>
          <button
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
            onClick={() => alert("Submitting grades to backend…")}
          >
            Submit Grades
          </button>
        </div>
      </div>

      {/* Add student */}
      <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-2 text-sm font-semibold">Add Student</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          <input
            placeholder="Reg No."
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={newRow.reg}
            onChange={(e) => setNewRow({ ...newRow, reg: e.target.value })}
          />
          <input
            placeholder="Full Name"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm md:col-span-2"
            value={newRow.name}
            onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
          />
          <input
            type="number"
            min={0}
            max={30}
            placeholder="CAT (0-30)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={newRow.cat}
            onChange={(e) => setNewRow({ ...newRow, cat: clamp(e.target.value, 30) })}
          />
          <input
            type="number"
            min={0}
            max={70}
            placeholder="Final (0-70)"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={newRow.final}
            onChange={(e) => setNewRow({ ...newRow, final: clamp(e.target.value, 70) })}
          />
        </div>
        <div className="mt-2">
          <button
            onClick={addStudent}
            className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Editable table */}
      <Table
        columns={[
          { key: "reg", header: "Reg No." },
          { key: "name", header: "Student" },
          {
            key: "cat",
            header: "CAT (30)",
            render: (v, row) => (
              <input
                type="number"
                min={0}
                max={30}
                className="w-24 rounded-lg border border-gray-200 px-2 py-1"
                value={v}
                onChange={(e) => updateCell(row.reg, "cat", e.target.value)}
              />
            ),
          },
          {
            key: "final",
            header: "Final (70)",
            render: (v, row) => (
              <input
                type="number"
                min={0}
                max={70}
                className="w-24 rounded-lg border border-gray-200 px-2 py-1"
                value={v}
                onChange={(e) => updateCell(row.reg, "final", e.target.value)}
              />
            ),
          },
          { key: "total", header: "Total (100)" },
          {
            key: "grade",
            header: "Grade",
            render: (v) => <GradeBadge grade={v} />,
          },
          {
            key: "actions",
            header: "Actions",
            render: (_v, row) => (
              <button
                onClick={() => removeStudent(row.reg)}
                className="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
              >
                Remove
              </button>
            ),
          },
        ]}
        data={rows}
        empty="No students found."
      />

      {/* Policy modal */}
      <Modal
        open={openPolicy}
        onClose={() => setOpenPolicy(false)}
        title="GAU-GradeView — Grading Policy"
        actions={
          <button
            onClick={() => setOpenPolicy(false)}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
          >
            Close
          </button>
        }
      >
        <div className="space-y-2 text-sm text-gray-700">
          <p>Marks are recorded as <strong>CAT (out of 30)</strong> and <strong>Final Exam (out of 70)</strong>. The system computes the total and assigns a grade automatically.</p>
          <ul className="list-disc pl-5">
            <li>Total = CAT + Final (maximum 100).</li>
            <li>Grade bands: A (70–100), B (60–69), C (50–59), D (40–49), Supplementary (≤39).</li>
          </ul>
        </div>
      </Modal>
    </LecturerLayout>
  );
}

function clamp(value, max) {
  const n = Number(value);
  if (Number.isNaN(n) || n < 0) return 0;
  if (n > max) return max;
  return Math.round(n);
}
function safeNum(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}
function getGrade(total) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "Supplementary";
}
function GradeBadge({ grade }) {
  const map = {
    A: "bg-emerald-50 text-emerald-700 border-emerald-200",
    B: "bg-lime-50 text-lime-700 border-lime-200",
    C: "bg-amber-50 text-amber-700 border-amber-200",
    D: "bg-orange-50 text-orange-700 border-orange-200",
    Supplementary: "bg-rose-50 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${map[grade] || "bg-gray-50 text-gray-700 border-gray-200"}`}
    >
      {grade}
    </span>
  );
}
