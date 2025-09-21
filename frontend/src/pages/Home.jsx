// // import React from 'react'
// // import { useAuth } from '../auth/AuthContext'


// // export default function Home(){
// // const { role } = useAuth()
// // return (
// // <div style={{padding:16}}>
// // <h2>Welcome to GAU‑GradeView</h2>
// // <p>Role‑based dashboard. Use the navbar to access your actions.</p>
// // <p>Current role: <b>{role || 'Guest'}</b></p>
// // </div>
// // )
// // }



// // src/pages/Home.jsx (Vite + React Router)
// import React from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";
// import {
//   AcademicCapIcon,
//   ExclamationCircleIcon,
//   DocumentTextIcon,
// } from "@heroicons/react/24/outline";

// export default function Home() {
//   const { role } = useAuth();

//   return (
//     <main className="bg-gray-100">
//       {/* Hero */}
//       <section className="py-16 px-6 sm:px-12 md:px-20">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
//           {/* Left content */}
//           <div className="md:w-1/2">
//             <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight">
//               Welcome to GAU-GradeView
//             </h1>

//             {/* Keeps your original text & role display (functional parity) */}
//             <p className="mt-4 text-gray-700 text-lg">
//               Seamlessly access academic grades, GPA summaries, and report
//               missing marks — all in one platform designed for Garissa
//               University students.
//             </p>
//             <p className="mt-3 text-sm text-gray-600">
//               Role-based dashboard. Use the navbar to access your actions.{" "}
//               <span className="block mt-1">
//                 Current role:{" "}
//                 <b className="text-green-800">{role || "Guest"}</b>
//               </span>
//             </p>

//             {/* CTA Buttons (React Router, not Next.js) */}
//             <div className="mt-6 flex flex-col sm:flex-row gap-4">
//               <Link
//                 to="/view-grades"
//                 className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 transition text-center"
//               >
//                 View My Grades
//               </Link>
//               <Link
//                 to="/report-missing-marks" /* change to /report-missing if your route uses that */
//                 className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded hover:bg-gray-200 transition text-center"
//               >
//                 Report Missing Mark
//               </Link>
//             </div>
//           </div>

//           {/* Right illustration (inline SVG, no deps) */}
//           <div className="md:w-1/2 flex justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="w-64 h-64 text-green-700"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9 17v-2m4 2v-4m4 4V7M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Why Use GAU-GradeView */}
//         <div className="mt-24 max-w-6xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-green-800 mb-6">
//             Why Use GAU-GradeView?
//           </h2>
//           <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-12">
//             GAU-GradeView provides a centralized, user-friendly system that
//             simplifies how students and faculty manage academic records, grade
//             reports, and issue tracking — all while ensuring efficiency,
//             accuracy, and accessibility.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//             <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
//               <AcademicCapIcon className="w-12 h-12 text-green-700 mb-4" />
//               <h3 className="font-semibold text-lg text-green-800 mb-2">
//                 Academic Clarity
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 View a comprehensive academic history — from year one to
//                 graduation — with clear organization and accessible breakdowns
//                 of each semester’s performance.
//               </p>
//             </div>

//             <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
//               <ExclamationCircleIcon className="w-12 h-12 text-green-700 mb-4" />
//               <h3 className="font-semibold text-lg text-green-800 mb-2">
//                 Instant Grade Reporting
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 Report missing or incorrect grades directly through the platform
//                 to ensure timely updates and accurate academic records.
//               </p>
//             </div>

//             <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
//               <DocumentTextIcon className="w-12 h-12 text-green-700 mb-4" />
//               <h3 className="font-semibold text-lg text-green-800 mb-2">
//                 Transcript Generation
//               </h3>
//               <p className="text-gray-600 text-sm">
//                 Easily generate and download official, print-ready transcripts
//                 to use for scholarships, applications, or future employment.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }



// src/pages/Home.jsx (Vite + React Router)
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  AcademicCapIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { role } = useAuth();

  return (
    <main className="bg-gray-100">
      {/* Hero */}
      <section className="py-16 px-6 sm:px-12 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left content */}
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight">
              Welcome to GAU-GradeView
            </h1>

            {/* Updated intro text */}
            <p className="mt-4 text-gray-700 text-lg">
              Seamlessly access academic grades, GPA summaries, and report
              missing marks — all in one platform designed for Garissa
              University students.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Empowering students and lecturers with a simple, reliable, and
              transparent way to manage academic progress at Garissa University.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                to="/view-grades"
                className="bg-green-700 text-white px-6 py-3 rounded hover:bg-green-800 transition text-center"
              >
                View My Grades
              </Link>
              <Link
                to="/report-missing-marks"
                className="bg-white border border-green-700 text-green-700 px-6 py-3 rounded hover:bg-gray-200 transition text-center"
              >
                Report Missing Mark
              </Link>
            </div>
          </div>

          {/* Right illustration */}
          <div className="md:w-1/2 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-64 h-64 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17v-2m4 2v-4m4 4V7M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
              />
            </svg>
          </div>
        </div>

        {/* Why Use GAU-GradeView */}
        <div className="mt-24 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-6">
            Why Use GAU-GradeView?
          </h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-12">
            GAU-GradeView provides a centralized, user-friendly system that
            simplifies how students and faculty manage academic records, grade
            reports, and issue tracking — all while ensuring efficiency,
            accuracy, and accessibility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
              <AcademicCapIcon className="w-12 h-12 text-green-700 mb-4" />
              <h3 className="font-semibold text-lg text-green-800 mb-2">
                Academic Clarity
              </h3>
              <p className="text-gray-600 text-sm">
                View a comprehensive academic history — from year one to
                graduation — with clear organization and accessible breakdowns
                of each semester’s performance.
              </p>
            </div>

            <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
              <ExclamationCircleIcon className="w-12 h-12 text-green-700 mb-4" />
              <h3 className="font-semibold text-lg text-green-800 mb-2">
                Instant Grade Reporting
              </h3>
              <p className="text-gray-600 text-sm">
                Report missing or incorrect grades directly through the platform
                to ensure timely updates and accurate academic records.
              </p>
            </div>

            <div className="bg-white rounded shadow-md p-6 flex flex-col items-center text-center">
              <DocumentTextIcon className="w-12 h-12 text-green-700 mb-4" />
              <h3 className="font-semibold text-lg text-green-800 mb-2">
                Transcript Generation
              </h3>
              <p className="text-gray-600 text-sm">
                Easily generate and download official, print-ready transcripts
                to use for scholarships, applications, or future employment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
