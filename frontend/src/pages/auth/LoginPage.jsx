import React, { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!regNumber || !password) {
      setError("Please fill in all fields.");
      return;
    }

    console.log("Logging in with:", { regNumber, password });
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Student Login
          </h2>
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-600 focus:border-green-600"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="E101/12345/23"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-600 focus:border-green-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition"
            >
              Login
            </button>

            <div className="text-center mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-green-700 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-700 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
