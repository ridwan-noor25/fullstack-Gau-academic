
// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { BellIcon } from "@heroicons/react/24/outline";
import { api } from "../api";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count for students
  useEffect(() => {
    if (user && role === 'student') {
      const fetchNotificationCount = async () => {
        try {
          const response = await api.get('/notifications');
          const unread = response.notifications?.filter(n => !n.is_read).length || 0;
          setUnreadCount(unread);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };
      
      fetchNotificationCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, role]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Info Bar (style only; no auth controls moved) */}
      <div className="bg-[#007C2E] text-white text-xs sm:text-sm px-4 md:px-20 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="whitespace-nowrap">For Support: (+254) 725621949</span>
          <span className="hidden sm:inline opacity-60">|</span>
          <a
            href="mailto:gradeview@gau.ac.ke"
            className="hover:underline"
            title="gradeview@gau.ac.ke"
          >
            gradeview@gau.ac.ke
          </a>
        </div>
        {/* <div className="text-white/80 hidden sm:block">
          GAU-GradeView
        </div> */}
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md h-[72px] sm:h-[80px] flex items-center gap-4 px-4 md:px-20">
        {/* Brand — logo is NOT a link */}
        <div className="flex items-center gap-3">
          <img
            src="/logoo.jpg"
            alt="GAU Logo"
            className="h-10 sm:h-12 md:h-14 object-contain select-none pointer-events-none"
            draggable="false"
          />
          {/* Keep home link (same as your original) */}
          {/* <Link to="/" className="font-semibold text-gray-800 hover:text-green-800 transition">
            GAU-GradeView
          </Link> */}
        </div>

        {/* Role-based menu (identical routes/labels as you had)
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">dashboard</Link>
              <Link to="/admin/departments" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Departments</Link>
              <Link to="/admin/register" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Create User</Link>
              <Link to="/admin/units" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Units</Link>
              <Link to="/admin/enroll" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Enroll</Link>
            </>
          )}

          {role === "hod" && (
            <>
              <Link to="/hod/pending" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Pending Grades</Link>
              <Link to="/hod/publish" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Publish Unit</Link>
              <Link to="/hod/lecturers/new" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Add Lec</Link>
            </>
          )}

          {role === "lecturer" && (
            <>
              <Link to="/lec/assessments" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Assessments</Link>
              <Link to="/lec/grades" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Enter Grades</Link>
            </>
          )} */}

          {/* {role === "student" && (
            <>
              <Link to="/student/grades" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">My Grades</Link>
              <Link to="/student/report-missing" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Report Missing</Link>
            </>
          )} */}
        {/* </div> */}

        {/* Auth controls (right side) — unchanged logic */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700">
                {user.email} ({user.role})
              </span>
              
              {/* Notification bell for students */}
              {role === 'student' && (
                <div className="relative">
                  <button
                    className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title={`${unreadCount} unread notifications`}
                  >
                    <BellIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}
              
              <button
                onClick={logout}
                className="inline-flex items-center rounded-md bg-white text-green-700 border border-green-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center rounded-md bg-green-700 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-800 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-md bg-white text-green-700 border border-green-700 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition"
              >
                SignUp
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

