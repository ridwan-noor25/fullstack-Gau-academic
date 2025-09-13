// src/pages/lecturers/Dashboard.jsx
import React from "react";

export default function Dashboard() {
  const courses = [
    { code: "MAT 201", name: "Calculus II", semester: "Y2S1", size: 72 },
    { code: "CHE 205", name: "Organic Chemistry I", semester: "Y2S1", size: 64 },
    { code: "EDU 210", name: "Educational Psychology", semester: "Y2S1", size: 58 },
  ];

  const missing = [
    {
      id: "MM-001",
      student: "Ali Hussein",
      reg: "GU/ED/1234/23",
      course: "MAT 201",
      assessment: "CAT 1",
      reason: "Was hospitalised",
      status: "Pending",
      submittedAt: "2025-08-10T09:30:00Z",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Lecturer Dashboard</h1>

      <section className="grid gap-4 md:grid-cols-3">
        {courses.map((c) => (
          <div key={c.code} className="rounded-2xl shadow p-4">
            <div className="text-sm opacity-70">{c.semester}</div>
            <div className="font-medium">{c.code}</div>
            <div className="text-sm">{c.name}</div>
            <div className="text-xs mt-2">Enrolled: {c.size}</div>
          </div>
        ))}
      </section>

      <h2 className="text-xl font-semibold mt-8 mb-2">Missing Marks</h2>
      <div className="overflow-x-auto rounded-2xl shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Student</th>
              <th className="p-3">Reg</th>
              <th className="p-3">Course</th>
              <th className="p-3">Assess.</th>
              <th className="p-3">Status</th>
              <th className="p-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {missing.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.id}</td>
                <td className="p-3">{m.student}</td>
                <td className="p-3">{m.reg}</td>
                <td className="p-3">{m.course}</td>
                <td className="p-3">{m.assessment}</td>
                <td className="p-3">{m.status}</td>
                <td className="p-3">{new Date(m.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
