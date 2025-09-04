// src/pages/lecturers/UnitStudents.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUnitStudents } from "../../utils/lecturerApi";

export default function UnitStudents() {
  const { unitId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    setLoading(true);
    setErr("");
    getUnitStudents(unitId)
      .then((es) => on && setItems(es))
      .catch((e) => on && setErr(e.message || "Failed to load students"))
      .finally(() => on && setLoading(false));
    return () => (on = false);
  }, [unitId]);

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
        <h2 className="text-lg font-semibold text-gray-900">Students — Unit #{unitId}</h2>
        <Link
          to={`/lecturer/units/${unitId}/assessments`}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Assessments
        </Link>
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
              <Th>Name</Th>
              <Th>Reg No</Th>
              <Th>Email</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.length === 0 && (
              <tr>
                <td colSpan="3" className="px-5 py-6 text-center text-gray-500">
                  No students enrolled.
                </td>
              </tr>
            )}
            {items.map((e) => (
              <tr key={e.id}>
                <Td className="font-medium">{e.student?.name || "—"}</Td>
                <Td>{e.student?.reg_number || "—"}</Td>
                <Td>{e.student?.email || "—"}</Td>
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
