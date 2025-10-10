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
  
  // Academic year fields for students
  const [academicYear, setAcademicYear] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [entryYear, setEntryYear] = useState("");
  const [regNumber, setRegNumber] = useState("");

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

    if (role === "student" && (!academicYear || !academicSession || !entryYear)) {
      setErr("Please fill in all academic year fields for students.");
      return;
    }

    try {
      const body = {
        name,
        email,
        password,
        role,
        department_id: department_id ? Number(department_id) : null,
      };

      // Add academic year fields for students
      if (role === "student") {
        body.reg_number = regNumber;
        body.academic_year = parseInt(academicYear);
        body.academic_session = academicSession;
        body.entry_year = parseInt(entryYear);
      }

      const res = await api.request("/auth/register", {
        method: "POST",
        body,
      });
      setMsg(`Created: ${res.user.email} (${res.user.role})`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setDepartmentId("");
      setRegNumber("");
      setAcademicYear("");
      setAcademicSession("");
      setEntryYear("");
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
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
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

            {/* Student-specific fields */}
            {role === "student" && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                    <p className="text-sm text-gray-600">Additional details for student account</p>
                  </div>
                </div>

                {/* Registration Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 4h12v2H4V4zm0 4h12v2H4V8zm0 4h8v2H4v-2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., E101/12345/23"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Student's official registration number</p>
                </div>

                {/* Academic Year Fields */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                    Academic Progress Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Academic Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Year Level
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-white">Y</span>
                          </div>
                        </div>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                        >
                          <option value="">Select Year...</option>
                          <option value="1">🎓 Year 1 - Freshman</option>
                          <option value="2">📚 Year 2 - Sophomore</option>
                          <option value="3">🎯 Year 3 - Junior</option>
                          <option value="4">🏆 Year 4 - Senior</option>
                        </select>
                      </div>
                    </div>

                    {/* Academic Session */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Academic Session
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <select
                          value={academicSession}
                          onChange={(e) => setAcademicSession(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        >
                          <option value="">Select Session...</option>
                          <option value="2023/2024">📅 2023/2024</option>
                          <option value="2024/2025">📅 2024/2025</option>
                          <option value="2025/2026">📅 2025/2026</option>
                        </select>
                      </div>
                    </div>

                    {/* Entry Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year of Entry
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <select
                          value={entryYear}
                          onChange={(e) => setEntryYear(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                        >
                          <option value="">Entry Year...</option>
                          <option value="2022">🎯 Started 2022</option>
                          <option value="2023">🎯 Started 2023</option>
                          <option value="2024">🎯 Started 2024</option>
                          <option value="2025">🎯 Started 2025</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
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
