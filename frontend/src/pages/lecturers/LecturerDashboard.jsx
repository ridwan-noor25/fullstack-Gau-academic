// src/pages/lecturers/LecturerDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  InboxIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { getMyUnits, getMissingReports } from "../../utils/lecturerApi";

const Card = ({ title, value, icon: Icon, tone = "green" }) => {
  const map = {
    green: ["bg-green-50", "text-green-700"],
    blue: ["bg-blue-50", "text-blue-700"],
    amber: ["bg-amber-50", "text-amber-700"],
  };
  const [bg, text] = map[tone] || map.green;
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className={`h-8 w-8 ${text}`} />}
      </div>
    </div>
  );
};

export default function LecturerDashboard() {
  const [units, setUnits] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    async function load() {
      try {
        const [u, r] = await Promise.all([getMyUnits(), getMissingReports()]);
        if (!on) return;
        setUnits(u);
        setReports(r);
      } finally {
        if (on) setLoading(false);
      }
    }
    load();
    return () => (on = false);
  }, []);

  const pendingCount = useMemo(
    () => reports.filter((x) => x.status === "Pending").length,
    [reports]
  );

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card title="My Units" value={units.length} icon={BookOpenIcon} tone="blue" />
        <Card title="Pending Reports" value={pendingCount} icon={InboxIcon} tone="amber" />
        <Card title="Getting Started" value="Setup" icon={RocketLaunchIcon} />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">My Units</h2>
          </div>
          <ul className="divide-y">
            {units.length === 0 && (
              <li className="px-5 py-6 text-gray-500 text-sm">No units assigned yet.</li>
            )}
            {units.map((u) => (
              <li key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {u.code} — {u.title}
                  </p>
                  <p className="text-xs text-gray-500">Dept ID: {u.department_id ?? "—"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/lecturer/units/${u.id}/assessments`}
                    className="text-sm px-3 py-1.5 rounded-md border border-green-700 text-green-700 hover:bg-gray-50"
                  >
                    Assessments
                  </Link>
                  <Link
                    to={`/lecturer/units/${u.id}/students`}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Students
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Missing Reports</h2>
          </div>
          <ul className="divide-y">
            {reports.length === 0 && (
              <li className="px-5 py-6 text-gray-500 text-sm">No reports.</li>
            )}
            {reports.slice(0, 8).map((r) => (
              <li key={r.id} className="px-5 py-3">
                <p className="font-medium text-gray-900">
                  {r.unit?.code} — {r.unit?.title}
                </p>
                <p className="text-xs text-gray-500">
                  {r.student?.name} ({r.student?.reg_number || "Reg —"})
                </p>
                <p className="text-xs mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">{r.status}</span>
                </p>
              </li>
            ))}
            {reports.length > 8 && (
              <li className="px-5 py-3">
                <Link
                  to="/lecturer/missing-reports"
                  className="text-sm text-green-700 hover:underline"
                >
                  View all
                </Link>
              </li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
