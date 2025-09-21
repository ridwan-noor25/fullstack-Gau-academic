// // src/pages/auth/ResetPassword.jsx
// import React, { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";

// export default function ResetPassword() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const token = new URLSearchParams(location.search).get("token") || "dev-token";

//   const [form, setForm] = useState({ password: "", confirm: "" });
//   const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (form.password.length < 6) {
//       return setStatus({ loading: false, ok: false, msg: "Password too short (min 6)." });
//     }
//     if (form.password !== form.confirm) {
//       return setStatus({ loading: false, ok: false, msg: "Passwords do not match." });
//     }

//     setStatus({ loading: true, ok: null, msg: "" });
//     try {
//       const res = await fetch("/api/auth/reset", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password: form.password }),
//       });
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data?.error || "Failed to reset password");
//       setStatus({ loading: false, ok: true, msg: data?.message || "Password reset successful. Redirecting…" });
//       setTimeout(() => navigate("/login"), 900);
//     } catch (err) {
//       setStatus({ loading: false, ok: false, msg: err.message });
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
//         <h1 className="mb-2 text-2xl font-semibold">Reset Password</h1>
//         <p className="mb-6 text-sm text-gray-600">Enter a new password for your account.</p>

//         {status.ok === true && (
//           <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{status.msg}</div>
//         )}
//         {status.ok === false && (
//           <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{status.msg}</div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="password"
//             required
//             placeholder="New password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             className="w-full rounded-xl border border-gray-200 px-3 py-2"
//           />
//           <input
//             type="password"
//             required
//             placeholder="Confirm password"
//             value={form.confirm}
//             onChange={(e) => setForm({ ...form, confirm: e.target.value })}
//             className="w-full rounded-xl border border-gray-200 px-3 py-2"
//           />
//           <button
//             type="submit"
//             disabled={status.loading}
//             className="w-full rounded-xl bg-emerald-600 px-3 py-2 font-medium text-white disabled:opacity-60"
//           >
//             {status.loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>

//         <p className="mt-6 text-sm text-center text-gray-600">
//           Changed your mind?{" "}
//           <Link to="/login" className="text-green-700 hover:underline">
//             Back to Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token") || "dev-token";

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      return setStatus({ loading: false, ok: false, msg: "Password too short (min 6)." });
    }
    if (form.password !== form.confirm) {
      return setStatus({ loading: false, ok: false, msg: "Passwords do not match." });
    }

    setStatus({ loading: true, ok: null, msg: "" });
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to reset password");
      setStatus({ loading: false, ok: true, msg: data?.message || "Password reset successful. Redirecting…" });
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: err.message });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="mb-2 text-2xl font-semibold">Reset Password</h1>
        <p className="mb-6 text-sm text-gray-600">Enter a new password for your account.</p>

        {status.ok === true && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{status.msg}</div>
        )}
        {status.ok === false && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{status.msg}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="New password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          />
          <input
            type="password"
            required
            placeholder="Confirm password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2"
          />
          <button
            type="submit"
            disabled={status.loading}
            className="w-full rounded-xl bg-emerald-600 px-3 py-2 font-medium text-white disabled:opacity-60"
          >
            {status.loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* ✅ Back to Login */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Changed your mind?{" "}
          <Link to="/login" className="text-green-700 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
