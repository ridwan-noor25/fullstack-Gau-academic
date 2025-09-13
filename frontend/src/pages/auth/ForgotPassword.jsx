// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, ok: null, msg: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      return setStatus({ loading: false, ok: false, msg: "Please enter your email or reg number." });
    }
    setStatus({ loading: true, ok: null, msg: "" });
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send reset link");
      setStatus({ loading: false, ok: true, msg: data?.message || "If this account exists, a reset link was sent." });
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: err.message });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Forgot Password</h2>

        {status.ok === true && (
          <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{status.msg}</p>
        )}
        {status.ok === false && (
          <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{status.msg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email or Reg Number</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-600 focus:border-green-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gau.ac.ke or GU/ED/1234/23"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-60"
          >
            {status.loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
            <Link to="/reset-password" className="text-sm text-green-700 hover:underline font-medium">
              Already have a reset link? Reset it here
            </Link>
          </div>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/login" className="text-green-700 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
