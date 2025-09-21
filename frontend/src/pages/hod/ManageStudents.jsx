// src/pages/hod/ManageStudents.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api";

export default function ManageStudents() {
  const { unitId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students (department or unit)
  async function fetchStudents() {
    setLoading(true);
    try {
      const url = unitId
        ? `/hod/units/${unitId}/students`
        : `/hod/students`;

      const res = await api.get(url);
      setStudents(res.items || []);
    } catch (err) {
      console.error("❌ Failed to fetch students:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [unitId]);

  // Delete student (soft or hard)
  async function handleDelete(studentId, mode = "soft") {
    const confirmMsg =
      mode === "hard"
        ? "⚠️ This will permanently delete the student. Continue?"
        : "Soft delete will deactivate the student. Continue?";

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.delete(`/hod/students/${studentId}?mode=${mode}`);
      setStudents((prev) =>
        prev.filter((s) => (s.student || s).id !== studentId)
      );
    } catch (err) {
      console.error(`❌ Failed to ${mode}-delete student:`, err.message);
    }
  }

  // Unenroll student from a unit
  async function handleUnenroll(studentId) {
    if (!window.confirm("Unenroll this student from this unit?")) return;

    try {
      await api.delete(`/hod/units/${unitId}/students/${studentId}`);
      setStudents((prev) =>
        prev.filter((s) => (s.student || s).id !== studentId)
      );
    } catch (err) {
      console.error("❌ Failed to unenroll student:", err.message);
    }
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <Link
          to="/hod/students"
          className={`pb-2 ${
            !unitId
              ? "border-b-2 border-green-700 text-green-800 font-semibold"
              : "text-gray-600 hover:text-green-700"
          }`}
        >
          Department Students
        </Link>

        {unitId && (
          <span className="pb-2 border-b-2 border-green-700 text-green-800 font-semibold">
            Unit Students
          </span>
        )}
      </div>

      {/* Heading */}
      <h1 className="text-xl font-bold mb-4">
        {unitId ? `Unit ${unitId} Students` : "All Department Students"}
      </h1>

      {/* Loader */}
      {loading && <p className="text-gray-500">Loading students...</p>}

      {/* Empty state */}
      {!loading && students.length === 0 && (
        <p className="text-gray-500">No students found.</p>
      )}

      {/* Students list */}
      {!loading && students.length > 0 && (
        <ul className="divide-y border rounded">
          {students.map((s) => {
            const student = s.student || s; // API may wrap student

            return (
              <li
                key={student.id}
                className="p-3 flex items-center justify-between"
              >
                <div>
                  <span className="font-medium">{student.name}</span>{" "}
                  <span className="text-sm text-gray-500">
                    ({student.email})
                  </span>
                </div>

                <div className="flex gap-2">
                  {unitId && (
                    <button
                      onClick={() => handleUnenroll(student.id)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Unenroll
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(student.id, "hard")}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                     Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
