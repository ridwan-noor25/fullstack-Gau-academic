// src/pages/students/dashboard/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { getMyEnrollments, getMyGradesSafe } from "../../../utils/studentApi";

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

export default function StudentDashboard() {
  const [enrolls, setEnrolls] = useState([]);
  const [grades, setGrades] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const [e, g] = await Promise.all([getMyEnrollments(), getMyGradesSafe()]);
        setEnrolls(e);
        setGrades(g);
      } catch (e) {
        setErr(e.message || "Failed to load.");
      }
    })();
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Welcome</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your quick academic snapshot.
        </p>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Enrolled Units" value={enrolls.length} />
        <Stat label="Published Grades" value={grades.length} />
        <Stat label="GPA (placeholder)" value="—" />
        <Stat label="Alerts" value="0" />
      </div>
    </>
  );
}
