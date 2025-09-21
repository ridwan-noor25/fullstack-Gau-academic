

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Nav from "./components/Navbar";
// import Footer from "./components/Footer";

// // Public / common pages
// import Home from "./pages/Home";
// import Login from "./pages/LoginPage";
// import SignupPage from "./pages/auth/SignupPage";

// // ===================== ADMIN =====================
// import AdminShell from "./Admin/layout/AdminShell";
// import AdminDashboard from "./Admin/layout/AdminDashboard";
// import Departments from "./Admin/pages/Departments";
// import RegisterUser from "./Admin/RegisterUser";
// import AdminUnits from "./Admin/pages/Units";
// import Enroll from "./Admin/pages/Enroll";
// import Pending from "./Admin/pages/Pending";
// import Publish from "./Admin/pages/Publish";
// import DepartmentsOverview from "./Admin/pages/DepartmentsOverview";

// // ===================== LECTURER =====================
// import LecturerLayout from "./pages/lecturers/LecturerLayout";
// import LecturerDashboard from "./pages/lecturers/LecturerDashboard";
// import LecUnits from "./pages/lecturers/Units";
// import UnitAssessments from "./pages/lecturers/UnitAssessments";
// import UnitStudents from "./pages/lecturers/UnitStudents";
// import MissingReports from "./pages/lecturers/MissingReports";

// // ===================== STUDENT =====================
// import StudentLayout from "./pages/students/dashboard/StudentLayout";
// import StudentDashboard from "./pages/students/dashboard/StudentDashboard";
// import MissingReport from "./Admin/pages/MissingReport";

// // ===================== HOD =====================
// import HodLayout from "./pages/hod/HodLayout";
// import HodDashboard from "./pages/hod/HodDashboard";
// import HodLecturers from "./pages/hod/HodLecturers";
// import HodUnits from "./pages/hod/HodUnits";
// import HodPrograms from "./pages/hod/Programs";


// import MyGrades from "./pages/students/MyGrades";
// import EnrollUnits from "./pages/students/EnrollUnits";
// import ManageStudents from "./pages/hod/ManageStudents";

// // 404
// const NotFound = () => (
//   <div className="p-10 text-center">
//     <h1 className="text-2xl font-bold text-green-800">404 — Not Found</h1>
//     <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
//   </div>
// );

// export default function App() {
//   return (
//     <>
//       <Nav />

//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* ===================== ADMIN ===================== */}
//         <Route path="/admin" element={<AdminShell heading="Admin" />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="departments" element={<Departments />} />
//           <Route path="register" element={<RegisterUser />} />
//           <Route path="adminunits" element={<AdminUnits />} />
//           <Route path="enroll" element={<Enroll />} />
//           <Route path="pending" element={<Pending />} />
//           <Route path="publish" element={<Publish />} />
//           <Route path="overview" element={<DepartmentsOverview />} />
//         </Route>

//    {/* ===================== HOD ===================== */}
// <Route path="/hod" element={<HodLayout />}>
//   <Route index element={<Navigate to="dashboard" replace />} />
//   <Route path="dashboard" element={<HodDashboard />} />
//   <Route path="lecturers" element={<HodLecturers />} />
//   <Route path="units" element={<HodUnits />} />
//   <Route path="programs" element={<HodPrograms />} />
//   <Route path="students" element={<ManageStudents />} />  {/* ✅ Dept students */}
//   <Route path="units/:unitId/students" element={<ManageStudents />} /> {/* ✅ Unit students */}
// </Route>

//         {/* ===================== LECTURER ===================== */}
//         <Route path="/lecturer" element={<LecturerLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<LecturerDashboard />} />
//           <Route path="units" element={<LecUnits />} />
//           <Route path="units/:unitId/assessments" element={<UnitAssessments />} />
//           <Route path="units/:unitId/students" element={<UnitStudents />} />
//           <Route path="missing-reports" element={<MissingReports />} />
//         </Route>

//         {/* ===================== STUDENT ===================== */}
//         <Route path="/student" element={<StudentLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<StudentDashboard />} />
//           <Route path="enroll" element={<EnrollUnits />} />
//           <Route path="grades" element={<MyGrades />} />
//           <Route path="reports" element={<MissingReport />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       <Footer />
//     </>
//   );
// }







// // src/App.jsx
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Nav from "./components/Navbar";
// import Footer from "./components/Footer";

// // Public / common pages
// import Home from "./pages/Home";
// import Login from "./pages/LoginPage";
// import SignupPage from "./pages/auth/SignupPage";
// import ForgotPassword from "./pages/auth/ForgotPassword";   // ✅ Added
// import ResetPassword from "./pages/auth/ResetPassword";     // ✅ Added

// // ===================== ADMIN =====================
// import AdminShell from "./Admin/layout/AdminShell";
// import AdminDashboard from "./Admin/layout/AdminDashboard";
// import Departments from "./Admin/pages/Departments";
// import RegisterUser from "./Admin/RegisterUser";
// import AdminUnits from "./Admin/pages/Units";
// import Enroll from "./Admin/pages/Enroll";
// import Pending from "./Admin/pages/Pending";
// import Publish from "./Admin/pages/Publish";
// import DepartmentsOverview from "./Admin/pages/DepartmentsOverview";

// // ===================== LECTURER =====================
// import LecturerLayout from "./pages/lecturers/LecturerLayout";
// import LecturerDashboard from "./pages/lecturers/LecturerDashboard";
// import LecUnits from "./pages/lecturers/Units";
// import UnitAssessments from "./pages/lecturers/UnitAssessments";
// import UnitStudents from "./pages/lecturers/UnitStudents";
// import MissingReports from "./pages/lecturers/MissingReports";

// // ===================== STUDENT =====================
// import StudentLayout from "./pages/students/dashboard/StudentLayout";
// import StudentDashboard from "./pages/students/dashboard/StudentDashboard";
// import MissingReport from "./Admin/pages/MissingReport";

// // ===================== HOD =====================
// import HodLayout from "./pages/hod/HodLayout";
// import HodDashboard from "./pages/hod/HodDashboard";
// import HodLecturers from "./pages/hod/HodLecturers";
// import HodUnits from "./pages/hod/HodUnits";
// import HodPrograms from "./pages/hod/Programs";
// import ManageStudents from "./pages/hod/ManageStudents";

// import MyGrades from "./pages/students/MyGrades";
// import EnrollUnits from "./pages/students/EnrollUnits";

// // 404
// const NotFound = () => (
//   <div className="p-10 text-center">
//     <h1 className="text-2xl font-bold text-green-800">404 — Not Found</h1>
//     <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
//   </div>
// );

// export default function App() {
//   return (
//     <>
//       <Nav />

//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ New */}
//         <Route path="/reset-password" element={<ResetPassword />} />   {/* ✅ New */}

//         {/* ===================== ADMIN ===================== */}
//         <Route path="/admin" element={<AdminShell heading="Admin" />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="departments" element={<Departments />} />
//           <Route path="register" element={<RegisterUser />} />
//           <Route path="adminunits" element={<AdminUnits />} />
//           <Route path="enroll" element={<Enroll />} />
//           <Route path="pending" element={<Pending />} />
//           <Route path="publish" element={<Publish />} />
//           <Route path="overview" element={<DepartmentsOverview />} />
//         </Route>

//         {/* ===================== HOD ===================== */}
//         <Route path="/hod" element={<HodLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<HodDashboard />} />
//           <Route path="lecturers" element={<HodLecturers />} />
//           <Route path="units" element={<HodUnits />} />
//           <Route path="programs" element={<HodPrograms />} />
//           <Route path="students" element={<ManageStudents />} />  {/* ✅ Dept students */}
//           <Route path="units/:unitId/students" element={<ManageStudents />} /> {/* ✅ Unit students */}
//         </Route>

//         {/* ===================== LECTURER ===================== */}
//         <Route path="/lecturer" element={<LecturerLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<LecturerDashboard />} />
//           <Route path="units" element={<LecUnits />} />
//           <Route path="units/:unitId/assessments" element={<UnitAssessments />} />
//           <Route path="units/:unitId/students" element={<UnitStudents />} />
//           <Route path="missing-reports" element={<MissingReports />} />
//         </Route>

//         {/* ===================== STUDENT ===================== */}
//         <Route path="/student" element={<StudentLayout />}>
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<StudentDashboard />} />
//           <Route path="enroll" element={<EnrollUnits />} />
//           <Route path="grades" element={<MyGrades />} />
//           <Route path="reports" element={<MissingReport />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>

//       <Footer />
//     </>
//   );
// }



// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Nav from "./components/Navbar";
import Footer from "./components/Footer";

// Public / common pages
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ForgotPassword from "./pages/auth/ForgotPassword";   // ✅ Added
import ResetPassword from "./pages/auth/ResetPassword";     // ✅ Added

// ===================== ADMIN =====================
import AdminShell from "./Admin/layout/AdminShell";
import AdminDashboard from "./Admin/layout/AdminDashboard";
import Departments from "./Admin/pages/Departments";
import RegisterUser from "./Admin/RegisterUser";
import AdminUnits from "./Admin/pages/Units";
import Enroll from "./Admin/pages/Enroll";
import Pending from "./Admin/pages/Pending";
import Publish from "./Admin/pages/Publish";
import DepartmentsOverview from "./Admin/pages/DepartmentsOverview";

// ===================== LECTURER =====================
import LecturerLayout from "./pages/lecturers/LecturerLayout";
import LecturerDashboard from "./pages/lecturers/LecturerDashboard";
import LecUnits from "./pages/lecturers/Units";
import UnitAssessments from "./pages/lecturers/UnitAssessments";
import UnitStudents from "./pages/lecturers/UnitStudents";
import MissingReports from "./pages/lecturers/MissingReports";

// ===================== STUDENT =====================
import StudentLayout from "./pages/students/dashboard/StudentLayout";
import StudentDashboard from "./pages/students/dashboard/StudentDashboard";
import MissingReport from "./Admin/pages/MissingReport";

// ===================== HOD =====================
import HodLayout from "./pages/hod/HodLayout";
import HodDashboard from "./pages/hod/HodDashboard";
import HodLecturers from "./pages/hod/HodLecturers";
import HodUnits from "./pages/hod/HodUnits";
import HodPrograms from "./pages/hod/Programs";
import ManageStudents from "./pages/hod/ManageStudents";

import MyGrades from "./pages/students/MyGrades";
import EnrollUnits from "./pages/students/EnrollUnits";

// 404
const NotFound = () => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold text-green-800">404 — Not Found</h1>
    <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
  </div>
);

export default function App() {
  return (
    <>
      <Nav />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ New */}
        <Route path="/reset-password" element={<ResetPassword />} />   {/* ✅ New */}

        {/* ===================== ADMIN ===================== */}
        <Route path="/admin" element={<AdminShell heading="Admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="register" element={<RegisterUser />} />
          <Route path="adminunits" element={<AdminUnits />} />
          <Route path="enroll" element={<Enroll />} />
          <Route path="pending" element={<Pending />} />
          <Route path="publish" element={<Publish />} />
          <Route path="overview" element={<DepartmentsOverview />} />
        </Route>

        {/* ===================== HOD ===================== */}
        <Route path="/hod" element={<HodLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HodDashboard />} />
          <Route path="lecturers" element={<HodLecturers />} />
          <Route path="units" element={<HodUnits />} />
          <Route path="programs" element={<HodPrograms />} />
          <Route path="students" element={<ManageStudents />} />  {/* ✅ Dept students */}
          <Route path="units/:unitId/students" element={<ManageStudents />} /> {/* ✅ Unit students */}
        </Route>

        {/* ===================== LECTURER ===================== */}
        <Route path="/lecturer" element={<LecturerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<LecturerDashboard />} />
          <Route path="units" element={<LecUnits />} />
          <Route path="units/:unitId/assessments" element={<UnitAssessments />} />
          <Route path="units/:unitId/students" element={<UnitStudents />} />
          <Route path="missing-reports" element={<MissingReports />} />
        </Route>

        {/* ===================== STUDENT ===================== */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="enroll" element={<EnrollUnits />} />
          <Route path="grades" element={<MyGrades />} />
          <Route path="reports" element={<MissingReport />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
