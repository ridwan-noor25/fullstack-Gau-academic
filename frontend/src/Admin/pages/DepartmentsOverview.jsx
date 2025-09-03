import React, { useEffect, useState, useMemo } from "react";
import { api } from "../../api";
import RequireAuth from "../../components/RequireAuth";
import { ArrowPathIcon, UserCircleIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

function getHodName(d) {
  return d?.hod_name || d?.hodName || d?.hod_full_name || d?.hod?.name || null;
}
function getHodEmail(d) {
  return d?.hod_email || d?.hodEmail || d?.hod?.email || null;
}

function DepartmentsOverviewInner() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await api.request("/departments");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((d) => {
      const nm = (d.name || "").toLowerCase();
      const cd = (d.code || "").toLowerCase();
      const hn = (getHodName(d) || "").toLowerCase();
      const he = (getHodEmail(d) || "").toLowerCase();
      return nm.includes(s) || cd.includes(s) || hn.includes(s) || he.includes(s);
    });
  }, [items, q]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-extrabold text-green-900">
              <BuildingOffice2Icon className="h-7 w-7 text-green-800" />
              Departments &amp; HoDs
            </h1>
            <p className="text-sm text-gray-600">Browse all departments and their current Heads of Department.</p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-lg bg-white border px-3 py-2 text-sm hover:bg-gray-50"
            title="Refresh"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by department, code, or HoD…"
            className="w-full sm:w-96 rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
          />
        </div>

        {/* Alerts */}
        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {err}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Departments</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 pb-6 text-sm text-gray-500">No departments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>#</Th>
                    <Th>Department</Th>
                    <Th>Code</Th>
                    <Th>Head of Department</Th>
                    <Th>Contact</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map((d, i) => {
                    const hodName = getHodName(d);
                    const hodEmail = getHodEmail(d);
                    const assigned = Boolean(hodName || hodEmail);
                    return (
                      <tr key={d.id || `${d.code}-${i}`} className="hover:bg-gray-50">
                        <Td className="w-16">{i + 1}</Td>
                        <Td className="font-medium">{d.name || "—"}</Td>
                        <Td>{d.code || "—"}</Td>
                        <Td>
                          <span className="inline-flex items-center gap-2">
                            <UserCircleIcon className="h-5 w-5 text-gray-500" />
                            {hodName || "—"}
                          </span>
                        </Td>
                        <Td>
                          {hodEmail ? (
                            <a href={`mailto:${hodEmail}`} className="text-sm text-green-700 underline">
                              {hodEmail}
                            </a>
                          ) : (
                            "—"
                          )}
                        </Td>
                        <Td>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                              assigned ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {assigned ? "Assigned" : "Unassigned"}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-gray-500">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-5 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}

export default function DepartmentsOverview() {
  return (
    <RequireAuth roles={["admin"]}>
      <DepartmentsOverviewInner />
    </RequireAuth>
  );
}
