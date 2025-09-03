import React, { useEffect, useState } from "react";
import { api } from "../../api";
import RequireAuth from "../../components/RequireAuth";
import { ArrowPathIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

function DepartmentsInner() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  async function create(e) {
    e.preventDefault();
    setErr("");
    try {
      setSubmitting(true);
      const d = await api.request("/departments", {
        method: "POST",
        body: { name, code },
      });
      setItems((prev) => [...prev, d]);
      setName("");
      setCode("");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-900">Departments</h1>
            <p className="text-sm text-gray-600">
              Create new departments and view the current list.
            </p>
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

        {/* Alerts */}
        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {err}
          </div>
        )}

        {/* Create form */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <PlusCircleIcon className="h-5 w-5 text-green-700" />
            Create Department
          </h2>

          <form onSubmit={create} className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                placeholder="e.g. Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700">Code</label>
              <input
                placeholder="e.g. COMP"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2.5 shadow-sm focus:border-green-600 focus:ring-green-600"
              />
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-green-700/70 transition hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">All Departments</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-700" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 pb-6 text-sm text-gray-500">No departments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>#</Th>
                    <Th>Name</Th>
                    <Th>Code</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((d, i) => (
                    <tr key={d.id || `${d.name}-${i}`} className="hover:bg-gray-50">
                      <Td className="w-16">{i + 1}</Td>
                      <Td className="font-medium">{d.name}</Td>
                      <Td>{d.code}</Td>
                    </tr>
                  ))}
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

export default function Departments() {
  return (
    <RequireAuth roles={["admin"]}>
      <DepartmentsInner />
    </RequireAuth>
  );
}
