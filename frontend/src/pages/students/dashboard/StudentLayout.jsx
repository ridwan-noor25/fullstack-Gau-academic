// src/pages/students/dashboard/StudentLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const getInitials = (name) =>
  name ? name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase() : 'S';

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const s = localStorage.getItem('student');
    setStudent(s ? JSON.parse(s) : null);
  }, []);
  useEffect(() => setSidebarOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-white md:grid md:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar (column 1) */}
      <aside
        className="hidden md:block sticky top-[20px] mt-[0px] h-[calc(100vh-30px)] z-10"
        aria-label="Sidebar"
      >
        <StudentSidebar />
      </aside>

      {/* Mobile overlay sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        <StudentSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main (column 2) */}
      <div className="min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  type="button"
                  className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>
                <div className="ml-2 md:ml-0 flex items-center">
                       <h1 className="text-2xl font-bold text-green-800">
          Welcome back, {student?.name || "Student"}
        </h1>
                </div>
              </div>

              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-medium text-sm">
                  {getInitials(student?.name)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{student?.name || 'Student'}</p>
                  <p className="text-xs font-medium text-gray-500">{student?.reg_number || 'Registration Number'}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}


        <main className="px-4 sm:px-6 lg:px-8 py-6">
          {/* No overlapping, no hidden sections */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}


