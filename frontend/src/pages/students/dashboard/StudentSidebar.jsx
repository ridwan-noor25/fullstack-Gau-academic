// src/pages/students/dashboard/StudentSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon, AcademicCapIcon, ChartBarIcon, ExclamationCircleIcon,
  UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const StudentSidebar = ({ onNavigate }) => {
  const location = useLocation();
  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'My Grades', href: '/student/grades', icon: AcademicCapIcon },
    { name: 'GPA Summary', href: '/student/gpa', icon: ChartBarIcon },
    { name: 'Report Missing Mark', href: '/student/report', icon: ExclamationCircleIcon },
    { name: 'Profile', href: '/student/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/student/settings', icon: Cog6ToothIcon },
  ];
  const isActive = (p) => location.pathname === p || location.pathname.startsWith(p + '/');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full bg-white w-64 border-r border-gray-800">
      {/* Brand */}
      <div className="flex items-center justify-center h-16 px-4 border-b bg-white">
        <div className="text-black text-center">
          <h1 className="font-bold text-lg">GAU-GradeView</h1>
          <p className="text-xs text-black-100">Student Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition
                ${active
                  ? 'bg-gray-100 text-green-800 font-semibold border-l-4 border-green-700'
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </nav>

      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <p className="text-xs text-gray-500">Garissa University · GAU-GradeView</p>
      </div>
    </div>
  );
};

export default StudentSidebar;
