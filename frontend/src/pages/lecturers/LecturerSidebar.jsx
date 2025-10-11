import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  HomeIcon,
  BookOpenIcon,
  InboxIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function LecturerSidebar({ onNavigate }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      name: "Dashboard", 
      href: "/lecturer/dashboard", 
      icon: HomeIcon 
    },
    { 
      name: "My Units", 
      href: "/lecturer/units", 
      icon: BookOpenIcon 
    },
    { 
      name: "Missing Reports", 
      href: "/lecturer/missing-reports", 
      icon: InboxIcon 
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`h-full border-r bg-white flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-between px-4">
        {!isCollapsed && (
          <div className="text-center flex-1">
            <h1 className="font-bold text-lg">GAU-GradeView</h1>
            <p className="text-xs text-gray-500">Lecturer Portal</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                active
                  ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.name : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}


