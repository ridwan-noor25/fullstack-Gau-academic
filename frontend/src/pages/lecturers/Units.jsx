// src/pages/lecturers/Units.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyUnits } from "../../utils/lecturerApi";

export default function Units() {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    setPending(true);
    setErr("");
    getMyUnits()
      .then((u) => on && setItems(u))
      .catch((e) => on && setErr(e.message || "Failed to load units"))
      .finally(() => on && setPending(false));
    return () => (on = false);
  }, []);

  if (pending) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
      </div>
    );
  }
  if (err) {
    return <div className="text-red-600">{err}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Units</h2>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <Th>Code</Th>
            <Th>Title</Th>
            <Th>Department</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.length === 0 && (
            <tr>
              <td colSpan="4" className="px-5 py-6 text-center text-gray-500">
                No units assigned yet.
              </td>
            </tr>
          )}
          {items.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <Td>{u.code}</Td>
              <Td className="font-medium">{u.title}</Td>
              <Td>{u.department_id ?? "—"}</Td>
              <Td>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/lecturer/units/${u.id}/assessments`}
                    className="text-xs px-3 py-1.5 rounded-md border border-green-700 text-green-700 hover:bg-gray-50"
                  >
                    Assessments
                  </Link>
                  <Link
                    to={`/lecturer/units/${u.id}/students`}
                    className="text-xs px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Students
                  </Link>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
