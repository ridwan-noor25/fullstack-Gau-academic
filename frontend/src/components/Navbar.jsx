// 

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'


export default function Nav() {
const { user, role, logout } = useAuth()
return (
<nav style={{display:'flex',gap:12,alignItems:'center',padding:12,borderBottom:'1px solid #ddd'}}>
<Link to="/">GAU‑GradeView</Link>
{role === 'admin' && (
<>
<Link to="/admin/departments">Departments</Link>
<Link to="/admin/register">Create User</Link>
<Link to="/admin/units">Units</Link>
<Link to="/admin/enroll">Enroll</Link>
</>
)}
{role === 'hod' && (
<>
<Link to="/hod/pending">Pending Grades</Link>
<Link to="/hod/publish">Publish Unit</Link>
</>
)}
{role === 'lecturer' && (
<>
<Link to="/lec/assessments">Assessments</Link>
<Link to="/lec/grades">Enter Grades</Link>
</>
)}
{role === 'student' && (
<>
<Link to="/student/grades">My Grades</Link>
<Link to="/student/report-missing">Report Missing</Link>
</>
)}
<div style={{marginLeft:'auto'}}>
{user ? (
<>
<span style={{marginRight:8}}>{user.email} ({user.role})</span>
<button onClick={logout}>Logout</button>
</>
) : (
    <>
<Link to="/login">Login</Link>
<Link to="/signup">SignUp</Link>
</>
)}
</div>
</nav>
)
}




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
