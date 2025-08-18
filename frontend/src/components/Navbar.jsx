// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function Navbar () {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Info Bar */}
      <div className="bg-[#007C2E] text-white text-sm px-4 md:px-20 py-2 flex justify-between items-center">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <i className="fas fa-phone-alt"></i>
          <a href="tel:+254725621949" className="hover:underline">
           For Support: (+254) 725621949
          </a>
          <span>|</span>
          <i className="fas fa-envelope"></i>
          <a href="mailto:gradeview@gau.ac.ke" className="hover:underline">
          gradeview@gau.ac.ke
         </a>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="bg-green-700 text-white border border-white px-4 py-1 rounded text-sm hover:bg-green-800 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-green-700 border border-green-700 px-4 py-1 rounded text-sm hover:bg-gray-100 transition"
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md h-[80px] flex justify-between items-center px-4 md:px-20">
        {/* Logo */}
        <a href="https://gau.ac.ke/">
          <img
            src="/logoo.jpg"
            alt="GAU Logo"
            className="h-12 md:h-16 object-contain"
          />
        </a>

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          <Link to="/" className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition">
            Home
          </Link>
          <Link
            to="/view-grades" className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition">
            View Grades
          </Link>
          {/* <Link
            to="/report-missing-marks" className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition">
            Missing Marks
          </Link>
          <Link to="/lecturers-portal" className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition">
            Lecturers' Portal
          </Link> */}
          <Link
            to="/guide" className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition">
            Guide
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
