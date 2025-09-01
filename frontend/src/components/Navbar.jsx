// // 

// import React from 'react'
// import { Link } from 'react-router-dom'
// import { useAuth } from '../auth/AuthContext'


// export default function Nav() {
// const { user, role, logout } = useAuth()
// return (
// <nav style={{display:'flex',gap:12,alignItems:'center',padding:12,borderBottom:'1px solid #ddd'}}>
// <Link to="/">GAU‑GradeView</Link>
// {role === 'admin' && (
// <>
// <Link to="/admin/departments">Departments</Link>
// <Link to="/admin/register">Create User</Link>
// <Link to="/admin/units">Units</Link>
// <Link to="/admin/enroll">Enroll</Link>
// </>
// )}
// {role === 'hod' && (
// <>
// <Link to="/hod/pending">Pending Grades</Link>
// <Link to="/hod/publish">Publish Unit</Link>
// <Link to="/hod/lecturers/new">Add Lec</Link>
// </>
// )}
// {role === 'lecturer' && (
// <>
// <Link to="/lec/assessments">Assessments</Link>
// <Link to="/lec/grades">Enter Grades</Link>
// </>
// )}
// {role === 'student' && (
// <>
// <Link to="/student/grades">My Grades</Link>
// <Link to="/student/report-missing">Report Missing</Link>
// </>
// )}
// <div style={{marginLeft:'auto'}}>
// {user ? (
// <>
// <span style={{marginRight:8}}>{user.email} ({user.role})</span>
// <button onClick={logout}>Logout</button>
// </>
// ) : (
//     <>
// <Link to="/login">Login</Link>
// <Link to="/signup">SignUp</Link>
// </>
// )}
// </div>
// </nav>
// )
// }




// // src/components/Navbar.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// // Adjust the path below to where your auth helpers live
// import { getRole, clearSession } from "../lib/auth";

// const Navbar = () => {
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setRole(getRole());
//   }, []);

//   const handleLogout = () => {
//     clearSession();
//     navigate("/login");
//   };

//   const publicMenu = [
//     { href: "/", label: "Home" },
//     { href: "/view-grades", label: "GradeView" },
//     { href: "/report-missing-marks", label: "Missing Marks" },
//     { href: "/guide", label: "Guide" },
//   ];

//   const authedMenu = (r) => [
//     { href: "/", label: "Home" },
//     { href: `/${r}/dashboard`, label: "Dashboard" },
//     { href: "/guide", label: "Guide" },
//   ];

//   const menu = role ? authedMenu(role) : publicMenu;

//   return (
//     <header className="sticky top-0 z-50 w-full">
//       {/* Info Bar */}
//       <div className="bg-[#007C2E] text-white text-sm px-4 md:px-20 py-2 flex justify-between items-center">
//         <div className="flex items-center space-x-4">
//           <span className="whitespace-nowrap">For Support: (+254) 725621949</span>
//           <span className="hidden sm:inline opacity-80">|</span>
//           <a
//             href="mailto:gradeview@gau.ac.ke"
//             className="hover:underline"
//             title="gradeview@gau.ac.ke"
//           >
//             gradeview@gau.ac.ke
//           </a>
//         </div>
//         <div className="flex items-center space-x-3">
//           {!role ? (
//             <>
//               <Link
//                 to="/login"
//                 className="bg-green-700 text-white border border-white px-4 py-1 rounded text-sm hover:bg-green-800 transition"
//               >
//                 Login
//               </Link>
//               <Link
//                 to="/signup"
//                 className="bg-white text-green-700 border border-green-700 px-4 py-1 rounded text-sm hover:bg-gray-100 transition"
//               >
//                 Signup
//               </Link>
//             </>
//           ) : (
//             <button
//               onClick={handleLogout}
//               className="bg-white text-green-700 border border-green-700 px-4 py-1 rounded text-sm hover:bg-gray-100 transition"
//             >
//               Logout
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Main Navbar */}
//       <nav className="bg-white shadow-md h-[80px] flex justify-between items-center px-4 md:px-20">
//         {/* Brand */}
//         <div className="flex items-center gap-3">
//           <a href="https://gau.ac.ke/" target="_blank" rel="noreferrer">
//             <img src="/logoo.jpg" alt="GAU Logo" className="h-12 md:h-16 object-contain" />
//           </a>
//           <Link to="/" className="hidden sm:block font-semibold text-gray-800">
//             GAU AcademicView
//           </Link>
//         </div>

//         {/* Menu */}
//         <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
//           {menu.map((item) => (
//             <Link
//               key={item.href}
//               to={item.href}
//               className="text-gray-800 hover:text-green-700 font-medium text-sm sm:text-base px-3 py-2 transition"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;





// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();

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

        {/* Role-based menu (identical routes/labels as you had) */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {role === "admin" && (
            <>
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
          )}

          {/* {role === "student" && (
            <>
              <Link to="/student/grades" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">My Grades</Link>
              <Link to="/student/report-missing" className="px-3 py-2 text-sm sm:text-base font-medium text-gray-800 hover:text-green-700 transition">Report Missing</Link>
            </>
          )} */}
        </div>

        {/* Auth controls (right side) — unchanged logic */}
        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-700">
                {user.email} ({user.role})
              </span>
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

