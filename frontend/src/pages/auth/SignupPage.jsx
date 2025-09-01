// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// function SignupPage() {
//   const [formData, setFormData] = useState({
//     name: "",
//     regNumber: "",
//     course: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, regNumber, course, email, password, confirmPassword } = formData;

//     if (!name || !regNumber || !course || !email || !password || !confirmPassword) {
//       setError("Please fill in all fields.");
//       setSuccess("");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       setSuccess("");
//       return;
//     }

//     try {
//       setError("");
//       setSuccess("");

//       const API_BASE = "http://127.0.0.1:5000";
//       const res = await fetch(`${API_BASE}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           regNumber,
//           course,
//           email,
//           password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Failed to create account.");
//         setSuccess("");
//         return;
//       }

//       setSuccess(data?.message || "Account created successfully. You can now log in.");
//       setFormData({
//         name: "",
//         regNumber: "",
//         course: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError("Network error. Please try again.");
//       setSuccess("");
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
//           <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
//             Create Your Account
//           </h2>

//           {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
//           {success && <p className="text-green-700 text-sm mb-4">{success}</p>}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.name}
//             />
//             <input
//               type="text"
//               name="regNumber"
//               placeholder="Registration Number"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.regNumber}
//             />
//             <input
//               type="text"
//               name="course"
//               placeholder="Course"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.course}
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.email}
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.password}
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
//               onChange={handleChange}
//               value={formData.confirmPassword}
//             />
//             <button
//               type="submit"
//               className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition"
//             >
//               Sign Up
//             </button>
//           </form>

//           <p className="mt-6 text-sm text-center text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-green-700 hover:underline">
//               Login here
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// }

// export default SignupPage;


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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, regNumber, course, email, password, confirmPassword } =
      formData;

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

      setSuccess(
        data?.message || "Account created successfully. You can now log in."
      );
      setFormData({
        name: "",
        regNumber: "",
        course: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch {
      setError("Network error. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Page Heading */}
          <div className="mb-5">
            <span className="inline-block text-[10px] uppercase tracking-widest text-green-700/80 bg-white px-2.5 py-1 rounded-full">
              GAU-GradeView
            </span>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-green-900">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Join your student portal to view grades, track GPA, and more.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-gray-200">
            <div className="p-6 md:p-8">
              {/* Alerts */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
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
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="grid gap-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative mt-1">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM2 16a6 6 0 1112 0H2z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g., Amina Hassan"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.name}
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Reg Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number
                    </label>
                    <div className="relative mt-1">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="regNumber"
                        placeholder="E101/12345/23"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.regNumber}
                        autoComplete="off"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Use your official GAU format.
                    </p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Course
                    </label>
                    <div className="relative mt-1">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v2l-8 4-8-4V4z" />
                          <path d="M18 8l-8 4-8-4v6a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="course"
                        placeholder="e.g., BSc. Computer Science"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.course}
                        autoComplete="organization-title"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
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
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.email}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        name="password"
                        placeholder="Enter a strong password"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.password}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password
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
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        className="w-full rounded-md border border-gray-300 bg-white p-2.5 pl-10 shadow-sm focus:border-green-600 focus:ring-green-600"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 font-medium text-white shadow-sm ring-1 ring-green-700/70 transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884l7.197 4.147a1 1 0 00.998 0l7.197-4.147A2 2 0 0016.764 4H3.236a2 2 0 00-1.233 1.884z" />
                    <path d="M18 8.118l-7.5 4.317a2 2 0 01-2 0L1 8.118V14a2 2 0 002 2h13a2 2 0 002-2V8.118z" />
                  </svg>
                  Sign Up
                </button>

                {/* Footer */}
                <p className="pt-2 text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-green-700 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Tiny note */}
          <p className="mt-4 text-xs text-gray-500">
            By signing up you agree to the GAU-GradeView terms & privacy policy.
          </p>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
