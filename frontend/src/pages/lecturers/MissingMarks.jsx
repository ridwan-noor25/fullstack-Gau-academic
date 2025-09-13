// src/pages/lecturers/MissingMarks.jsx
import React from "react";
import LecturerLayout from "../../components/lecturer/Layout";
import Table from "../../components/lecturer/Table";
import useLocalStorage from "../../hooks/useLocalStorage";

function MissingMarks() {
  const [store, setStore] = useLocalStorage("gau-lecturer", { missing: [] });

  function setStatus(id, status) {
    setStore((s) => ({
      ...s,
      missing: (s.missing || []).map((m) => (m.id === id ? { ...m, status } : m)),
    }));
  }

  return (
    <LecturerLayout>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Missing Marks — All Courses</h1>
        <div className="text-sm text-gray-500">
          Review, approve, or reject student requests.
        </div>
      </div>

      <Table
        columns={[
          { key: "id", header: "ID" },
          { key: "student", header: "Student" },
          { key: "reg", header: "Reg No." },
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
          {
            key: "actions",
            header: "Actions",
            render: (_v, row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => setStatus(row.id, "Approved")}
                  className="rounded-lg bg-emerald-600 px-2 py-1 text-xs text-white"
                >
                  Approve
                </button>
                <button
                  onClick={() => setStatus(row.id, "Rejected")}
                  className="rounded-lg bg-rose-600 px-2 py-1 text-xs text-white"
                >
                  Reject
                </button>
              </div>
            ),
          },
        ]}
        data={store.missing || []}
        empty="No requests."
      />
    </LecturerLayout>
  );
}
export default MissingMarks