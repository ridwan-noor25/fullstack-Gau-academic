// src/pages/LoginPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const { login, role: ctxRole, user: ctxUser } = useAuth();

  const roleToPath = (r) => {
    const role = (r || "").toLowerCase();
    if (role === "student") return "/student/dashboard";
    if (role === "admin") return "/admin/dashboard";
    if (role === "hod") return "/hod/dashboard";
    if (role === "lecturer") return "/lecturers/dashboard";
  };

  // If someone visits /login while already authenticated, push them to their dashboard
  useEffect(() => {
    const existingRole =
      (ctxUser?.role || ctxRole || localStorage.getItem("role") || "").toLowerCase();
    if (existingRole) {
      nav(roleToPath(existingRole), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      // Do not destructure; some implementations of login() return void.
      const result = await login(email, password); // may be undefined or { token, user }

      // Resolve role from (in order): login result, context, localStorage
      const resolvedRole =
        (result && result.user && result.user.role) ||
        ctxRole ||
        (ctxUser && ctxUser.role) ||
        localStorage.getItem("role") ||
        "";

      nav(roleToPath(resolvedRole), { replace: true });
    } catch (e) {
      setErr(String(e.message || e));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
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
