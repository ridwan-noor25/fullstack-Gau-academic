// src/pages/lecturers/MissingReports.jsx
import { useEffect, useState } from "react";
import { getMissingReports, updateMissingReport } from "../../utils/lecturerApi"

const StatusPill = ({ s }) => {
  const map = {
    Pending: "bg-amber-50 text-amber-800",
    Seen: "bg-blue-50 text-blue-800",
    Resolved: "bg-green-50 text-green-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs ${map[s] || "bg-gray-100 text-gray-700"}`}>{s}</span>;
};

export default function MissingReports() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setErr("");
    try {
      const r = await getMissingReports();
      setItems(r);
    } catch (e) {
      setErr(e.message || "Failed to load reports");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpdate(r, patch) {
    setSavingId(r.id);
    setErr("");
    try {
      const upd = await updateMissingReport(r.id, patch);
      setItems((prev) => prev.map((x) => (x.id === r.id ? upd : x)));
    } catch (e) {
      setErr(e.message || "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Missing Reports</h2>
        <button
          onClick={load}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Student</Th>
              <Th>Reg No</Th>
              <Th>Unit</Th>
              <Th>Message</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-6 text-center text-gray-500">
                  No reports.
                </td>
              </tr>
            )}
            {items.map((r) => (
              <tr key={r.id} className="align-top">
                <Td className="font-medium">{r.student?.name || "—"}</Td>
                <Td>{r.student?.reg_number || "—"}</Td>
                <Td>
                  <div className="font-medium">{r.unit?.code}</div>
                  <div className="text-xs text-gray-500">{r.unit?.title}</div>
                </Td>
                <Td className="max-w-[28rem]">
                  <div className="text-gray-900">{r.message || "—"}</div>
                  {r.lecturer_note && (
                    <div className="mt-1 text-xs text-gray-600">Note: {r.lecturer_note}</div>
                  )}
                </Td>
                <Td><StatusPill s={r.status} /></Td>
                <Td>
                  <div className="flex flex-col gap-2 w-44">
                    <select
                      className="rounded-md border border-gray-300 p-2 text-sm"
                      value={r.status}
                      disabled={savingId === r.id}
                      onChange={(e) => onUpdate(r, { status: e.target.value })}
                    >
                      <option>Pending</option>
                      <option>Seen</option>
                      <option>Resolved</option>
                    </select>
                    <textarea
                      className="rounded-md border border-gray-300 p-2 text-sm"
                      placeholder="Add note…"
                      defaultValue={r.lecturer_note || ""}
                      onBlur={(e) => onUpdate(r, { lecturer_note: e.target.value })}
                    />
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
