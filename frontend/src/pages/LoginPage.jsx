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



import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function Login() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [err, setErr] = useState('')
const nav = useNavigate()
const loc = useLocation()
const { login } = useAuth()


const onSubmit = async e => {
e.preventDefault()
setErr('')
try {
await login(email, password)
const to = loc.state?.from?.pathname || '/'
nav(to, { replace: true })
} catch (e) { setErr(String(e.message || e)) }
}


return (
<div style={{maxWidth:420,margin:'48px auto'}}>
<h2>Login</h2>
{err && <p style={{color:'crimson'}}>{err}</p>}
<form onSubmit={onSubmit}>
<label>Email<br/>
<input value={email} onChange={e=>setEmail(e.target.value)} required />
</label><br/>
<label>Password<br/>
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
</label><br/>
<button type="submit">Login</button>
</form>
<p style={{marginTop:16}}>Admin not created? Use Flask shell to create the first admin.</p>
</div>
)
}