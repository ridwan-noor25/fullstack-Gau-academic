// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function LoginPage() {
//   const [regNumber, setRegNumber] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!regNumber || !password) {
//       setError("Please fill in all fields.");
//       setSuccess("");
//       return;
//     }

//     setError("");
//     setSuccess("");
//     setLoading(true);

//     try {
//       const API_BASE = "http://127.0.0.1:5000";
//       const res = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         // Send both keys to be safe with your Flask backend
//         body: JSON.stringify({ reg_number: regNumber, regNumber, password }),
//       });

//       // Try to parse JSON even on errors
//       let data = null;
//       try {
//         data = await res.json();
//       } catch {
//         /* ignore parse errors */
//       }

//       if (!res.ok) {
//         const msg =
//           (data && (data.error || data.message)) ||
//           `Login failed (HTTP ${res.status})`;
//         throw new Error(msg);
//       }

//     const token = data?.token || data?.access_token || null;
// let student = data?.student || data?.user || null;
// if (student && !student.role) student = { ...student, role: "student" };

// if (token) localStorage.setItem("token", token);
// if (student) localStorage.setItem("student", JSON.stringify(student));


//       setSuccess(data?.message || "Login successful.");
//       // Redirect after saving auth
//       navigate("/student/dashboard", { replace: true });
//     } catch (err) {
//       setError(err.message || "Network error. Please try again.");
//       setSuccess("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
//           <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
//             Student Login
//           </h2>

//           {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
//           {success && <p className="text-green-700 text-sm mb-4">{success}</p>}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Registration Number
//               </label>
//               <input
//                 type="text"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-600 focus:border-green-600"
//                 value={regNumber}
//                 onChange={(e) => setRegNumber(e.target.value)}
//                 placeholder="E101/12345/23"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-600 focus:border-green-600"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>

//             <div className="text-center mt-2">
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-green-700 hover:underline font-medium"
//               >
//                 Forgot Password?
//               </Link>
//             </div>
//           </form>

//           <p className="mt-6 text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-green-700 hover:underline">
//               Sign up here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default LoginPage;



// import React, { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../auth/AuthContext'


// export default function Login() {
// const [email, setEmail] = useState('')
// const [password, setPassword] = useState('')
// const [err, setErr] = useState('')
// const nav = useNavigate()
// const loc = useLocation()
// const { login } = useAuth()


// const onSubmit = async e => {
// e.preventDefault()
// setErr('')
// try {
// await login(email, password)
// const to = loc.state?.from?.pathname || '/'
// nav(to, { replace: true })
// } catch (e) { setErr(String(e.message || e)) }
// }


// return (
// <div style={{maxWidth:420,margin:'48px auto'}}>
// <h2>Login</h2>
// {err && <p style={{color:'crimson'}}>{err}</p>}
// <form onSubmit={onSubmit}>
// <label>Email<br/>
// <input value={email} onChange={e=>setEmail(e.target.value)} required />
// </label><br/>
// <label>Password<br/>
// <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
// </label><br/>
// <button type="submit">Login</button>
// </form>
// <p style={{marginTop:16}}>Admin not created? Use Flask shell to create the first admin.</p>
// </div>
// )
// }



// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(email, password);
      const to = loc.state?.from?.pathname || "/";
      nav(to, { replace: true });
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          {/* <span className="inline-block text-[10px] uppercase tracking-widest text-green-800/80 bg-green-100 px-2.5 py-1 rounded-full">
            GAU-GradeView
          </span> */}
          <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-green-900">
            Login
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Access your dashboard securely.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200">
          <div className="p-6 md:p-8">
            {/* Error */}
            {err && (
              <div
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2"
                role="alert"
                aria-live="polite"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.585c.75 1.334-.213 3.016-1.742 3.016H3.48c-1.53 0-2.492-1.682-1.742-3.016L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V8a1 1 0 112 0v3a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{err}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="grid gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.94 6.34A2 2 0 014.6 5h10.8a2 2 0 011.66.94L10 10.5 2.94 6.34z" />
                      <path d="M18 8.118l-8 4.882-8-4.882V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="block w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm transition focus:border-green-600 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 8V6a5 5 0 1110 0v2h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm transition focus:border-green-600 focus:ring-green-600"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-green-700/70 transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                Login
              </button>
            </form>

            {/* Helper */}
            <p className="mt-4 text-xs text-gray-500">
              Trouble logging in? Ensure your email & password are correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
