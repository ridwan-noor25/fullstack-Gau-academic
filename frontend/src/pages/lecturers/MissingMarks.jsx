// src/pages/lecturers/MissingMarks.jsx
import React, { useEffect, useState } from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import Table from "../../components/lecturer/Table";

function MissingMarks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMissing() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/lecturer/missing-reports", { credentials: "include" });
        const data = await res.json();
        if (data.items) {
          setRows(
            data.items.map((item) => ({
              id: item.id,
              student: item.student_name || item.name || item.student || "—",
              reg: item.reg_number || item.regNo || item.reg_no || "—",
              course: item.unit_title || item.unit_code || item.unit || "—",
              assessment: item.assessment || "—",
              reason: item.message || item.description || "—",
              status: item.status || "Pending",
            }))
          );
        } else {
          setRows([]);
        }
      } catch (e) {
        setError("Failed to load missing reports");
        setRows([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMissing();
  }, []);

  return (
    <LecturerLayout>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Missing Marks — All Courses</h1>
        <div className="text-sm text-gray-500">
          Review, approve, or reject student requests.
        </div>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "student_name", header: "Student" },
          { key: "reg_number", header: "Reg No." },
          { key: "course", header: "Course" },
          { key: "assessment", header: "Assessment" },
          { key: "reason", header: "Reason" },
          {
            key: "status",
            header: "Status",
            render: (v) => (
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  v === "Approved"
                    ? "bg-emerald-50 text-emerald-700"
                    : v === "Rejected"
                    ? "bg-rose-50 text-rose-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {v}
              </span>
            ),
          },
        ]}
  data={rows}
        empty={loading ? "Loading..." : "No requests."}
      />
    </LecturerLayout>
  );
}
export default MissingMarks