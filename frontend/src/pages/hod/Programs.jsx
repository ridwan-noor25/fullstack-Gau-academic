// src/pages/hod/Programs.jsx
import React, { useEffect, useState } from "react";
import {
  listPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../../utils/hodApi"; // <-- matches exports

export default function HodPrograms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // create form
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [years, setYears] = useState(4);

  // inline edit
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({ code: "", name: "", duration_years: 4 });

  async function refresh() {
    setLoading(true);
    setErr("");
    try {
      const list = await listPrograms();
      setItems(list);
    } catch (e) {
      setErr(e.message || "Failed to load programs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    try {
      if (!code.trim() || !name.trim()) {
        setErr("Code and name are required.");
        return;
      }
      await createProgram({
        code: code.trim(),
        name: name.trim(),
        duration_years: Number(years) || 4,
      });
      setCode("");
      setName("");
      setYears(4);
      await refresh();
    } catch (e) {
      setErr(e.message || "Failed to create program.");
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEdit({
      code: p.code || "",
      name: p.name || "",
      duration_years: p.duration_years ?? 4,
    });
  }
  function cancelEdit() {
    setEditingId(null);
    setEdit({ code: "", name: "", duration_years: 4 });
  }
  async function saveEdit(id) {
    setErr("");
    try {
      await updateProgram(id, {
        code: edit.code.trim(),
        name: edit.name.trim(),
        duration_years: Number(edit.duration_years) || 4,
      });
      cancelEdit();
      await refresh();
    } catch (e) {
      setErr(e.message || "Failed to update program.");
    }
  }
  async function onDelete(id) {
    if (!confirm("Delete this program? All curriculum mappings will be removed.")) return;
    setErr("");
    try {
      await deleteProgram(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message || "Failed to delete program.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Programs</h1>
        <p className="text-sm text-gray-600">Create and manage degree programs.</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Create */}
      <form onSubmit={onCreate} className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Create Program</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="BCS"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Computer Science"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (years)</label>
            <input
              type="number"
              min="1"
              max="8"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Create Program
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Years</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-600">
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No programs yet.
                </td>
              </tr>
            ) : (
              items.map((p) => (
                <tr key={p.id}>
                  <Td>
                    {editingId === p.id ? (
                      <input
                        className="w-28 rounded-md border px-2 py-1"
                        value={edit.code}
                        onChange={(e) => setEdit((s) => ({ ...s, code: e.target.value }))}
                      />
                    ) : (
                      <span className="font-medium">{p.code}</span>
                    )}
                  </Td>
                  <Td>
                    {editingId === p.id ? (
                      <input
                        className="w-full rounded-md border px-2 py-1"
                        value={edit.name}
                        onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                      />
                    ) : (
                      p.name
                    )}
                  </Td>
                  <Td>
                    {editingId === p.id ? (
                      <input
                        type="number"
                        className="w-20 rounded-md border px-2 py-1"
                        value={edit.duration_years}
                        min={1}
                        max={8}
                        onChange={(e) => setEdit((s) => ({ ...s, duration_years: e.target.value }))}
                      />
                    ) : (
                      p.duration_years ?? "—"
                    )}
                  </Td>
                  <Td>
                    {editingId === p.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(p.id)}
                          className="rounded-md bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <a
                          href={`/hod/curriculum?program=${p.id}`}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                          title="Manage Curriculum"
                        >
                          Curriculum
                        </a>
                        <button
                          onClick={() => startEdit(p)}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600">{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
