// import React, { useEffect, useState } from 'react'
// import { api } from '../api'
// import RequireAuth from '../components/RequireAuth'

// function RegisterUserInner(){
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   (removed duplicate role useState)
//   const [department_id, setDepartmentId] = useState('')
//   const [departments, setDepartments] = useState([])

//   const [msg, setMsg] = useState('')
//   const [err, setErr] = useState('')

//   useEffect(() => {
//     // Load departments for dropdown
//     // NOTE: if your api helper does NOT auto-prefix '/api', change to '/api/departments'
//     api.request('/departments', { method: 'GET' })
//       .then((rows) => setDepartments(rows || []))
//       .catch((e) => setErr(String(e.message || e)))
//   }, [])

//   async function submit(e){
//     e.preventDefault(); setErr(''); setMsg('')

//     if (role === 'hod' && !department_id) {
//       setErr('Please select a department for HoD.')
//       return
//     }

//     try{
//       const res = await api.request('/auth/register', {
//         method:'POST',
//         body:{
//           name,
//           email,
//           password,
//           role,
//           department_id: department_id ? Number(department_id) : null
//         }
//       })
//       setMsg(`Created: ${res.user.email} (${res.user.role})`)
//       setName(''); setEmail(''); setPassword(''); setRole('lecturer'); setDepartmentId('')
//     }catch(e){
//       setErr(String(e.message||e))
//     }
//   }

//   return (
//     <div style={{padding:16, maxWidth: 520}}>
//       <h3>Create User (Admin)</h3>
//       {err && <p style={{color:'crimson'}}>{err}</p>}
//       {msg && <p style={{color:'green'}}>{msg}</p>}

//       <form onSubmit={submit}>
//         <div style={{ marginBottom: 8 }}>
//           <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} required style={{ width: '100%', padding: 8 }} />
//         </div>
//         <div style={{ marginBottom: 8 }}>
//           <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
//         </div>
//         <div style={{ marginBottom: 8 }}>
//           <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
//         </div>
//         <div style={{ marginBottom: 8 }}>
//           <select value={role} onChange={e=>setRole(e.target.value)} style={{ width: '100%', padding: 8 }}>
//             <option value="lecturer">lecturer</option>
//             <option value="student">student</option>
//             <option value="hod">hod</option>
//             <option value="admin">admin</option>
//           </select>
//         </div>

//         {/* Show department selection when creating HoD */}
//         {role === 'hod' && (
//           <div style={{ marginBottom: 12 }}>
//             <select
//               value={department_id}
//               onChange={e=>setDepartmentId(e.target.value)}
//               required
//               style={{ width: '100%', padding: 8 }}
//             >
//               <option value="">Select Department…</option>
//               {departments.map(d => (
//                 <option key={d.id} value={d.id}>
//                   {d.name} ({d.code})
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <button type="submit">Create</button>
//       </form>
//     </div>
//   )
// }

// export default function RegisterUser(){
//   return (
//     <RequireAuth roles={["admin"]}>
//       <RegisterUserInner/>
//     </RequireAuth>
//   )
// }



// src/pages/admin/RegisterUser.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import RequireAuth from "../components/RequireAuth";

function RegisterUserInner() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Only one declaration for role should exist. If another exists above, remove it.
  const [role, setRole] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api
      .request("/departments", { method: "GET" })
      .then((rows) => setDepartments(rows || []))
      .catch((e) => setErr(String(e.message || e)));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (role === "hod" && !department_id) {
      setErr("Please select a department for HoD.");
      return;
    }

    try {
      const res = await api.request("/auth/register", {
        method: "POST",
        body: {
          name,
          email,
          password,
          role,
          department_id: department_id ? Number(department_id) : null,
        },
      });
      setMsg(`Created: ${res.user.email} (${res.user.role})`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("lecturer");
      setDepartmentId("");
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header / Breadcrumb */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Admin
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">
            Create User
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Add HoDs or admins to GAU-GradeView.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Alerts */}
          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="grid gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                placeholder="e.g., Dr. Amina Hassan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-green-600 focus:border-green-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-green-600 focus:border-green-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Set a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 focus:ring-green-600 focus:border-green-600"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 bg-white focus:ring-green-600 focus:border-green-600"
                required
              >
                <option value="" disabled>Select Role…</option>
                <option value="hod">HoD</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                HoDs require a department selection.
              </p>
            </div>

            {/* Department (only when HoD) */}
            {role === "hod" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={department_id}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2.5 bg-white focus:ring-green-600 focus:border-green-600"
                >
                  <option value="">Select Department…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full md:w-auto bg-green-700 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={role === "hod" ? !department_id : !role}
            >
              Create User
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-gray-500 mt-4">
          Tip: Ensure the email is unique. Roles can be changed later by an
          admin.
        </p>
      </div>
    </div>
  );
}

export default function RegisterUser() {
  return (
    <RequireAuth roles={["admin"]}>
      <RegisterUserInner />
    </RequireAuth>
  );
}
