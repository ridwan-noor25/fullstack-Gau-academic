// // src/pages/hod/HodLecturers.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   hodListLecturers,
//   hodCreateLecturer,
//   hodUpdateLecturer,
//   hodDeleteLecturer,
//   hodListUnits,
// } from "../../utils/hodApi";

// export default function HodLecturers() {
//   const [list, setList] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [err, setErr] = useState("");
//   const [busy, setBusy] = useState(false);

//   // Create form
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [pwd, setPwd] = useState("");
//   const [assignIds, setAssignIds] = useState([]);

//   // Editing
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({ name: "", email: "", password: "", unit_ids: [] });

//   const unitIndex = useMemo(() => {
//     const map = new Map();
//     units.forEach((u) => map.set(u.id, u));
//     return map;
//   }, [units]);

//   async function refresh() {
//     try {
//       setErr("");
//       const [ls, us] = await Promise.all([hodListLecturers(), hodListUnits()]);
//       setList(ls);
//       setUnits(us);
//     } catch (e) {
//       setErr(e.message || "Failed to load.");
//     }
//   }

//   useEffect(() => { refresh(); }, []);

//   const toggleAssign = (id, setFn, current) => {
//     if (current.includes(id)) setFn(current.filter((x) => x !== id));
//     else setFn([...current, id]);
//   };

//   async function onCreate(e) {
//     e.preventDefault();
//     setBusy(true);
//     try {
//       await hodCreateLecturer({ name, email, password: pwd, unit_ids: assignIds });
//       setName(""); setEmail(""); setPwd(""); setAssignIds([]);
//       await refresh();
//     } catch (e2) {
//       setErr(e2.message || "Failed to create lecturer.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   function startEdit(lec) {
//     setEditingId(lec.id);
//     setEditForm({
//       name: lec.name || "",
//       email: lec.email || "",
//       password: "",
//       unit_ids: (lec.units || []).map((u) => u.id),
//     });
//   }

//   function cancelEdit() {
//     setEditingId(null);
//     setEditForm({ name: "", email: "", password: "", unit_ids: [] });
//   }

//   async function saveEdit() {
//     setBusy(true);
//     try {
//       const payload = { name: editForm.name, email: editForm.email, unit_ids: editForm.unit_ids };
//       if (editForm.password) payload.password = editForm.password;
//       await hodUpdateLecturer(editingId, payload);
//       cancelEdit();
//       await refresh();
//     } catch (e) {
//       setErr(e.message || "Failed to update lecturer.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function remove(id) {
//     if (!confirm("Delete this lecturer?")) return;
//     setBusy(true);
//     try {
//       await hodDeleteLecturer(id);
//       await refresh();
//     } catch (e) {
//       setErr(e.message || "Failed to delete lecturer.");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <>
//       <div className="mb-6">
//         <h1 className="text-2xl md:text-3xl font-semibold">Lecturers</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Create, update, delete lecturers and assign units.
//         </p>
//       </div>

//       {err && (
//         <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       {/* Create */}
//       <div className="rounded-2xl border bg-white shadow-sm p-4 md:p-5 mb-6">
//         <h2 className="text-lg font-semibold mb-3">Add Lecturer</h2>
//         <form onSubmit={onCreate} className="grid md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Full name</label>
//             <input
//               className="w-full rounded-xl border px-3 py-2"
//               value={name} onChange={(e) => setName(e.target.value)} required
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full rounded-xl border px-3 py-2"
//               value={email} onChange={(e) => setEmail(e.target.value)} required
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Password</label>
//             <input
//               type="password"
//               className="w-full rounded-xl border px-3 py-2"
//               value={pwd} onChange={(e) => setPwd(e.target.value)} required
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Assign Units</label>
//             <div className="max-h-40 overflow-auto rounded-xl border p-2">
//               {units.length === 0 ? (
//                 <div className="text-sm text-gray-500 p-2">No units in your department.</div>
//               ) : (
//                 units.map((u) => (
//                   <label key={u.id} className="flex items-center gap-2 px-2 py-1 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={assignIds.includes(u.id)}
//                       onChange={() => toggleAssign(u.id, setAssignIds, assignIds)}
//                     />
//                     <span className="font-medium">{u.code}</span>
//                     <span className="text-gray-500">— {u.title}</span>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>

//           <div className="md:col-span-2">
//             <button
//               disabled={busy}
//               className="inline-flex items-center rounded-xl bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-60"
//             >
//               {busy ? "Saving…" : "Create Lecturer"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* List / Edit */}
//       <div className="rounded-2xl border bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-left">
//             <thead className="bg-gray-50">
//               <tr>
//                 <Th>Name</Th>
//                 <Th>Email</Th>
//                 <Th>Units</Th>
//                 <Th className="text-right">Actions</Th>
//               </tr>
//             </thead>
//             <tbody>
//               {list.length === 0 ? (
//                 <tr>
//                   <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
//                     No lecturers yet.
//                   </td>
//                 </tr>
//               ) : (
//                 list.map((lec) => {
//                   const isEditing = editingId === lec.id;
//                   return (
//                     <tr key={lec.id} className="border-t align-top">
//                       <Td className="font-medium">
//                         {isEditing ? (
//                           <input
//                             className="w-full rounded-xl border px-3 py-2"
//                             value={editForm.name}
//                             onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
//                           />
//                         ) : (
//                           lec.name
//                         )}
//                       </Td>
//                       <Td>
//                         {isEditing ? (
//                           <input
//                             type="email"
//                             className="w-full rounded-xl border px-3 py-2"
//                             value={editForm.email}
//                             onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
//                           />
//                         ) : (
//                           <span className="text-gray-600">{lec.email}</span>
//                         )}
//                       </Td>
//                       <Td>
//                         {isEditing ? (
//                           <div className="max-h-40 overflow-auto rounded-xl border p-2">
//                             {units.map((u) => (
//                               <label key={u.id} className="flex items-center gap-2 px-2 py-1 text-sm">
//                                 <input
//                                   type="checkbox"
//                                   checked={editForm.unit_ids.includes(u.id)}
//                                   onChange={() =>
//                                     toggleAssign(u.id, (ids) =>
//                                       setEditForm((f) => ({
//                                         ...f,
//                                         unit_ids: ids(editForm.unit_ids),
//                                       }))
//                                     , editForm.unit_ids)
//                                   }
//                                 />
//                                 <span className="font-medium">{u.code}</span>
//                                 <span className="text-gray-500">— {u.title}</span>
//                               </label>
//                             ))}
//                           </div>
//                         ) : (
//                           <span className="text-gray-900">
//                             {(lec.units || []).length === 0
//                               ? "—"
//                               : lec.units.map((u) => u.code).join(", ")}
//                           </span>
//                         )}
//                         {isEditing && (
//                           <div className="mt-2">
//                             <label className="block text-sm text-gray-600 mb-1">New Password (optional)</label>
//                             <input
//                               type="password"
//                               className="w-full rounded-xl border px-3 py-2"
//                               placeholder="••••••••"
//                               value={editForm.password}
//                               onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
//                             />
//                           </div>
//                         )}
//                       </Td>
//                       <Td className="text-right">
//                         {!isEditing ? (
//                           <div className="inline-flex gap-2">
//                             <button
//                               onClick={() => startEdit(lec)}
//                               className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
//                             >
//                               Edit
//                             </button>
//                             <button
//                               onClick={() => remove(lec.id)}
//                               className="rounded-xl border px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
//                             >
//                               Delete
//                             </button>
//                           </div>
//                         ) : (
//                           <div className="inline-flex gap-2">
//                             <button
//                               onClick={saveEdit}
//                               disabled={busy}
//                               className="rounded-xl bg-green-700 px-3 py-1.5 text-sm text-white hover:bg-green-800 disabled:opacity-60"
//                             >
//                               Save
//                             </button>
//                             <button
//                               onClick={cancelEdit}
//                               className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
//                             >
//                               Cancel
//                             </button>
//                           </div>
//                         )}
//                       </Td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }

// function Th({ children, className = "" }) {
//   return <th className={`px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-500 ${className}`}>{children}</th>;
// }
// function Td({ children, className = "" }) {
//   return <td className={`px-4 py-3 text-sm ${className}`}>{children}</td>;
// }



// src/pages/hod/Lecturers.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  listLecturers,
  createLecturer,
  deleteLecturer,
  listUnits,
} from "../../utils/hodApi";

export default function HodLecturers() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [lecturers, setLecturers] = useState([]);
  const [units, setUnits] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedUnitIds, setSelectedUnitIds] = useState([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const [lecs, us] = await Promise.all([listLecturers(), listUnits()]);
        if (!alive) return;
        setLecturers(lecs);
        setUnits(us);
      } catch (e) {
        if (alive) setErr(e.message || "Failed to load.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => (alive = false);
  }, []);

  const onToggleUnit = (id) => {
    setSelectedUnitIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onCreate = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      if (!name || !email || !password) {
        setErr("Name, email, and password are required.");
        return;
      }
      await createLecturer({
        name,
        email,
        password,
        unit_ids: selectedUnitIds,
      });
      // refresh
      const [lecs, us] = await Promise.all([listLecturers(), listUnits()]);
      setLecturers(lecs);
      setUnits(us);
      setName("");
      setEmail("");
      setPassword("");
      setSelectedUnitIds([]);
    } catch (e) {
      setErr(e.message || "Failed to create lecturer.");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this lecturer?")) return;
    setErr("");
    try {
      await deleteLecturer(id);
      setLecturers((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message || "Failed to delete lecturer.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Lecturers</h1>
        <p className="text-sm text-gray-600">Create a lecturer and assign units immediately.</p>
      </header>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Create form */}
      <form onSubmit={onCreate} className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-medium mb-3">Create Lecturer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="e.g. Dr. Amina Ali"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="amina@gau.ac.ke"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Units multi-select (checkboxes) */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Assign Units (optional)</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {units.map((u) => (
              <label key={u.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedUnitIds.includes(u.id)}
                  onChange={() => onToggleUnit(u.id)}
                  className="h-4 w-4"
                />
                <span className="font-medium">{u.code}</span>
                <span className="text-gray-600">— {u.title}</span>
              </label>
            ))}
            {units.length === 0 && (
              <p className="text-sm text-gray-500">No units in your department yet.</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
          >
            Create Lecturer
          </button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-600">
                  Loading…
                </td>
              </tr>
            ) : lecturers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  No lecturers yet.
                </td>
              </tr>
            ) : (
              lecturers.map((l) => (
                <tr key={l.id}>
                  <Td className="font-medium">{l.name}</Td>
                  <Td>{l.email}</Td>
                  <Td>
                    <button
                      onClick={() => onDelete(l.id)}
                      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      Delete
                    </button>
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
  return (
    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-600">
      {children}
    </th>
  );
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-gray-900 ${className}`}>{children}</td>;
}
