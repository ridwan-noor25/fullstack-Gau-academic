// // // src/App.jsx
// // import React from "react";
// // import { Routes, Route, useLocation, Navigate } from "react-router-dom";
// // import Navbar from "./components/Navbar";
// // import Footer from "./components/Footer";
// // import { RequireAuth, RequireRole } from "./pages/auth/guards"; // ⬅️ use the guards we created

// // // Student pages
// // import HeroSection from "./pages/students/HeroSection";
// // import ViewGrades from "./pages/students/ViewGrades";
// // import ReportMissingMarks from "./pages/students/ReportMissingMarks";
// // import Guide from "./pages/students/Guide";

// // // Auth pages
// // import ForgotPassword from "./pages/auth/ForgotPassword";
// // import LoginPage from "./pages/LoginPage";
// // import ResetPassword from "./pages/auth/ResetPassword";
// // import SignupPage from "./pages/auth/SignupPage";

// // // Lecturer pages
// // import LecturerDashboard from "./pages/lecturers/Dashboard";
// // import Gradebook from "./pages/lecturers/Gradebook";
// // import MissingMarks from "./pages/lecturers/MissingMarks";
// // import Courses from "./pages/lecturers/Courses";
// // import Notifications from "./pages/lecturers/Notifications";
// // import Profile from "./pages/lecturers/Profile";

// // // HOD pages
// // import HodDashboard from "./components/hod/Dashboard";
// // import HodReports from "./components/hod/Reports";

// // // Student dashboard layout
// // import StudentLayout from "./pages/students/dashboard/StudentLayout";
// // import StudentDashboard from "./pages/students/dashboard/StudentDashboard";
// // import StudentSidebar from "./pages/students/dashboard/StudentSidebar";

// // const Forbidden = () => (
// //   <div className="p-10 text-center">
// //     <h1 className="text-2xl font-bold text-red-700">403 — Forbidden</h1>
// //     <p className="text-gray-600 mt-2">You don’t have permission to view this page.</p>
// //   </div>
// // );

// // const NotFound = () => (
// //   <div className="p-10 text-center">
// //     <h1 className="text-2xl font-bold text-green-800">404 — Not Found</h1>
// //     <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
// //   </div>
// // );

// // function App() {
// //   const location = useLocation();
// //   const isStaffArea =
// //     location.pathname.startsWith("/lecturer") ||
// //     location.pathname.startsWith("/hod");

// //   return (
// //     <>
// //       {!isStaffArea && <Navbar />}

// //       <Routes>
// //         {/* ---------- Public (auth pages only) ---------- */}
// //         <Route path="/login" element={<LoginPage />} />
// //         <Route path="/signup" element={<SignupPage />} />
// //         <Route path="/forgot-password" element={<ForgotPassword />} />
// //         <Route path="/reset-password" element={<ResetPassword />} />

// //         {/* ---------- Everything below requires authentication ---------- */}
// //         <Route
// //           path="/"
// //           element={
// //             <RequireAuth>
// //               <HeroSection />
// //             </RequireAuth>
// //           }
// //         />
// //         <Route
// //           path="/view-grades"
// //           element={
// //             <RequireAuth>
// //               <ViewGrades />
// //             </RequireAuth>
// //           }
// //         />
// //         <Route
// //           path="/report-missing-marks"
// //           element={
// //             <RequireAuth>
// //               <ReportMissingMarks />
// //             </RequireAuth>
// //           }
// //         />
// //         <Route
// //           path="/guide"
// //           element={
// //             <RequireAuth>
// //               <Guide />
// //             </RequireAuth>
// //           }
// //         />

// //         {/* ---------- Student Area (role: student) ---------- */}
// //         <Route
// //           path="/student"
// //           element={
// //             <RequireRole roles={["student"]}>
// //               <StudentLayout />
// //             </RequireRole>
// //           }
// //         >
// //           {/* index redirect to dashboard */}
// //           <Route index element={<Navigate to="dashboard" replace />} />
// //           {/* NOTE: nested paths must be relative */}
// //           <Route path="dashboard" element={<StudentDashboard />} />
// //           <Route path="sidebar" element={<StudentSidebar />} />
// //           {/* add other student routes here... */}
// //         </Route>

// //         {/* ---------- Lecturer Area (role: lecturer) ---------- */}
// //         <Route path="/lecturers" element={<Navigate to="/lecturer/dashboard" replace />} />
// //         <Route path="/lecturer" element={<Navigate to="/lecturer/dashboard" replace />} />

// //         <Route
// //           path="/lecturer/dashboard"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <LecturerDashboard />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/lecturer/gradebook"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <Gradebook />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/lecturer/missing-marks"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <MissingMarks />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/lecturer/courses"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <Courses />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/lecturer/notifications"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <Notifications />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/lecturer/profile"
// //           element={
// //             <RequireRole roles={["lecturer"]}>
// //               <Profile />
// //             </RequireRole>
// //           }
// //         />

// //         {/* ---------- HOD Area (role: hod) ---------- */}
// //         <Route path="/hod" element={<Navigate to="/hod/dashboard" replace />} />
// //         <Route
// //           path="/hod/dashboard"
// //           element={
// //             <RequireRole roles={["hod"]}>
// //               <HodDashboard />
// //             </RequireRole>
// //           }
// //         />
// //         <Route
// //           path="/hod/reports"
// //           element={
// //             <RequireRole roles={["hod"]}>
// //               <HodReports />
// //             </RequireRole>
// //           }
// //         />

// //         {/* ---------- Forbidden & Fallback ---------- */}
// //         <Route path="/forbidden" element={<Forbidden />} />
// //         <Route path="*" element={<NotFound />} />
// //       </Routes>

// //       {!isStaffArea && <Footer />}
// //     </>
// //   );
// // }

// // export default App;




// // import React from 'react'
// // import { Routes, Route } from 'react-router-dom'

// // import Home from './pages/Home'
// // import Login from './pages/LoginPage'
// // import Departments from './Admin/pages/Departments'
// // import RegisterUser from './Admin/RegisterUser'
// // import Units from './Admin/pages/Units'
// // import Enroll from './Admin/pages/Enroll'
// // import Pending from './Admin/pages/Pending'
// // import Publish from './Admin/pages/Publish'
// // import Assessments from './Admin/pages/Assessments'
// // import Grades from './Admin/pages/Grades'
// // import MyGrades from './Admin/pages/MyGrades'
// // import MissingReport from './Admin/pages/MissingReport'
// // import AuthProvider from './auth/AuthContext'
// // import Nav from './components/Navbar'
// // import SignupPage from './pages/auth/SignupPage'
// // import HodCreateLecturer from './Admin/pages/HodCreateLecturer'



// // export default function App(){
// // return (
// // <AuthProvider>
// // <Nav/>
// // <Routes>
// // <Route path="/" element={<Home/>} />
// // <Route path="/login" element={<Login/>} />
// // <Route path="/signup" element={<SignupPage/>} />
// // {/* Admin */}
// // <Route path="/admin/departments" element={<Departments/>} />
// // <Route path="/admin/register" element={<RegisterUser/>} />
// // <Route path="/admin/units" element={<Units/>} />
// // <Route path="/admin/enroll" element={<Enroll/>} />
// // {/* HoD */}
// // <Route path="/hod/pending" element={<Pending/>} />
// // <Route path="/hod/publish" element={<Publish/>} />
// // <Route path="/hod/lecturers/new" element={<HodCreateLecturer />} />
// // {/* Lecturer */}
// // <Route path="/lec/assessments" element={<Assessments/>} />
// // <Route path="/lec/grades" element={<Grades/>} />
// // {/* Student */}
// // <Route path="/student/grades" element={<MyGrades/>} />
// // <Route path="/student/report-missing" element={<MissingReport/>} />
// // </Routes>
// // </AuthProvider>
// // )
// // }


// // src/App.jsx
// import React from 'react';
// import { Routes, Route } from 'react-router-dom';

// import Home from './pages/Home';
// import Login from './pages/LoginPage';
// import Departments from './Admin/pages/Departments';
// import RegisterUser from './Admin/RegisterUser';
// import Units from './Admin/pages/Units';
// import Enroll from './Admin/pages/Enroll';
// import Pending from './Admin/pages/Pending';
// import Publish from './Admin/pages/Publish';
// import Assessments from './Admin/pages/Assessments';
// import Grades from './Admin/pages/Grades';
// import MyGrades from './Admin/pages/MyGrades';
// import MissingReport from './Admin/pages/MissingReport';
// import Nav from './components/Navbar';
// import SignupPage from './pages/auth/SignupPage';
// import HodCreateLecturer from './Admin/pages/HodCreateLecturer';

// // ⬇️ Student dashboard shell + page (added)
// import StudentLayout from './pages/students/dashboard/StudentLayout';
// import StudentDashboard from './pages/students/dashboard/StudentDashboard';
// import AdminDashboard from './Admin/layout/AdminDashboard';
// import AdminShell from './Admin/layout/AdminShell';
// import DepartmentsOverview from './Admin/pages/DepartmentsOverview';
// import ViewGrades from './pages/students/ViewGrades';

// export default function App() {
//   return (
//     <>
//       <Nav />
//       <Routes>
//         <Route path="/" element={<Home />} />

//         {/* Auth */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* Admin */}
//           <Route path="admin" element={<AdminShell heading="Admin" />}>
//           <Route index element={<AdminDashboard />} />
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="departments" element={<Departments />} />
//           <Route path="register" element={<RegisterUser />} />
//           <Route path="units" element={<Units />} />
//           <Route path="enroll" element={<Enroll />} />
//           <Route path="pending" element={<Pending />} />
//           <Route path="publish" element={<Publish />} />
//           <Route path="overview" element={<DepartmentsOverview />} />
//         </Route>


//         {/* HoD */}
//         <Route path="/hod/pending" element={<Pending />} />
//         <Route path="/hod/publish" element={<Publish />} />
//         <Route path="/hod/lecturers/new" element={<HodCreateLecturer />} />

//         {/* Lecturer */}
//         <Route path="/lec/assessments" element={<Assessments />} />
//         <Route path="/lec/grades" element={<Grades />} />

//         {/* Student */}
//         {/* Existing routes kept intact */}
//         <Route path="/student/grades" element={<MyGrades />} />
//         <Route path="/student/report-missing" element={<MissingReport />} />
//         {/* Alias so sidebar (/student/report) also works */}
//         <Route path="/student/report" element={<MissingReport />} />

//         {/* Student Dashboard (added, no breaking changes) */}
//         <Route path="/student/dashboard" element={<StudentLayout />}>
//         <Route path="/student/viewgrades" element={<ViewGrades />}>
//           <Route index element={<StudentDashboard />} />
//           {/* You can optionally add nested aliases later:
//               <Route path="grades" element={<MyGrades />} /> */}

//          </Route>
//         </Route>
//       </Routes>
//     </>
//   );
// }



// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Nav from "./components/Navbar";
import Footer from "./components/Footer"; // ⬅️ stays

// Public / common pages
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// ===================== ADMIN =====================
import AdminShell from "./Admin/layout/AdminShell";
import AdminDashboard from "./Admin/layout/AdminDashboard";
import Departments from "./Admin/pages/Departments";
import RegisterUser from "./Admin/RegisterUser";
import AdminUnits from "./Admin/pages/Units"; // alias to avoid name clash
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

// ===================== HOD (NEW) =====================
import HodLayout from "./pages/hod/HodLayout";
import HodDashboard from "./pages/hod/HodDashboard";
import HodLecturers from "./pages/hod/HodLecturers";
import HodUnits from "./pages/hod/HodUnits";

import MyGrades from "./pages/students/MyGrades";
// import Profile from "./pages/students/Profile";
// import Settings from "./pages/students/settings";
import EnrollUnits from "./pages/students/EnrollUnits";
import HodPrograms from "./pages/hod/Programs";

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

        {/* ===================== ADMIN ===================== */}
        <Route path="/admin" element={<AdminShell heading="Admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="register" element={<RegisterUser />} />
          <Route path="adminunits" element={<AdminUnits />} /> {/* aliased */}
          <Route path="enroll" element={<Enroll />} />
          <Route path="pending" element={<Pending />} />
          <Route path="publish" element={<Publish />} />
          <Route path="overview" element={<DepartmentsOverview />} />
        </Route>

               {/* ===================== HOD (nested under a layout) ===================== */}
        <Route path="/hod" element={<HodLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HodDashboard />} />
          <Route path="lecturers" element={<HodLecturers />} />
          <Route path="units" element={<HodUnits />} />
          <Route path="programs" element={<HodPrograms />} />
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
  {/* <Route path="profile" element={<Profile />} />
  <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}
