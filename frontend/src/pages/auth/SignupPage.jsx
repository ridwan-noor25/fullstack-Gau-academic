import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    course: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, regNumber, course, email, password, confirmPassword } = formData;

    if (!name || !regNumber || !course || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const API_BASE = "http://127.0.0.1:5000";
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          regNumber,
          course,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to create account.");
        setSuccess("");
        return;
      }

      setSuccess(data?.message || "Account created successfully. You can now log in.");
      setFormData({
        name: "",
        regNumber: "",
        course: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Network error. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Create Your Account
          </h2>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-700 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.name}
            />
            <input
              type="text"
              name="regNumber"
              placeholder="Registration Number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.regNumber}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.course}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.email}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.password}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              onChange={handleChange}
              value={formData.confirmPassword}
            />
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
