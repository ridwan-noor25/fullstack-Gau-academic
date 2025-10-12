// src/pages/students/dashboard/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { getMyEnrollments, getMyGradesSafe } from "../../../utils/studentApi";
import { api } from "../../../api";

function Stat({ label, value, loading = false }) {
  return (
    <div className="rounded-xl border bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 lg:p-5 shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
      <div className="text-xs sm:text-sm text-gray-600 font-medium uppercase tracking-wide">{label}</div>
      <div className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [enrolls, setEnrolls] = useState([]);
  const [grades, setGrades] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setErr("");
        setLoading(true);
        
        // Wait a moment for token to be restored
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Debug: Check if API has token
        const token = api.getToken();
        console.log('API token:', token ? `${token.substring(0, 20)}...` : 'No token');
        console.log('LocalStorage token:', localStorage.getItem('token') ? 'Present' : 'Missing');
        
        // Fetch basic data first
        const [e, g] = await Promise.all([
          getMyEnrollments(), 
          getMyGradesSafe()
        ]);
        
        setEnrolls(e);
        setGrades(g);
        
        // Fetch notifications separately with better error handling
        if (token) {
          try {
            const notifResponse = await api.get('/notifications/count');
            console.log('Notifications response:', notifResponse);
            setNotificationCount(notifResponse?.count ?? 0);
          } catch (notifError) {
            console.error('Notifications API error:', notifError);
            console.error('Error details:', notifError.response?.data);
            setNotificationCount(0);
          }
        } else {
          console.warn('No token available for notifications API');
          setNotificationCount(0);
        }
        
      } catch (e) {
        console.error('Dashboard error:', e);
        setErr(e.message || "Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">Welcome</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">Your quick academic snapshot.</p>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Responsive grid: 1 col on mobile, 2 on small screens, 4 on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        <Stat label="Enrolled Units" value={enrolls.length} loading={loading} />
        <Stat label="Published Grades" value={grades.length} loading={loading} />
        <Stat label="Pending Reviews" value="0" loading={loading} />
        <Stat 
          label="Notifications" 
          value={notificationCount > 0 ? notificationCount : "0"} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
