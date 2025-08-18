// src/pages/lecturers/Courses.jsx
import React, { useState } from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import useLocalStorage from "../../hooks/useLocalStorage";

function Courses() {
  const [store, setStore] = useLocalStorage("gau-lecturer", { courses: [] });
  const [form, setForm] = useState({ code: "", name: "", semester: "", size: 0 });

  function addCourse() {
    if (!form.code || !form.name) return;
    setStore((s) => ({ ...s, courses: [...(s.courses || []), form] }));
    setForm({ code: "", name: "", semester: "", size: 0 });
  }

  function removeCourse(code) {
    setStore((s) => ({ ...s, courses: (s.courses || []).filter((c) => c.code !== code) }));
  }

  return (
    <LecturerLayout>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Courses</h1>
        <div className="text-sm text-gray-500">Manage courses you teach.</div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold">Add Course</h3>
          <div className="grid gap-3 text-sm">
            <input
              placeholder="Code (e.g., MAT 201)"
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
            <input
              placeholder="Name"
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Semester (e.g., Y2S1)"
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
            />
            <input
              type="number"
              placeholder="Class size"
              className="rounded-xl border border-gray-200 px-3 py-2"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: Number(e.target.value) })}
            />
            <button
              onClick={addCourse}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
            >
              Add
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold">Your Courses</h3>
          <ul className="space-y-3">
            {(store.courses || []).map((c) => (
              <li
                key={c.code}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
              >
                <div>
                  <div className="font-medium">{c.code} — {c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.semester} • {c.size} students
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeCourse(c.code)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    Remove
                  </button>
                  <a
                    href="/lecturer/gradebook"
                    className="rounded-lg bg-gray-900 px-2 py-1 text-xs text-white"
                  >
                    Open Gradebook
                  </a>
                </div>
              </li>
            ))}
            {(store.courses || []).length === 0 && (
              <li className="text-sm text-gray-500">No courses yet.</li>
            )}
          </ul>
        </div>
      </div>
    </LecturerLayout>
  );
}
export default Courses