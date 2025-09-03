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

// Public / common pages
import Home from "./pages/Home";
import Login from "./pages/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// Admin
import AdminShell from "./Admin/layout/AdminShell";
import AdminDashboard from "./Admin/layout/AdminDashboard";
import Departments from "./Admin/pages/Departments";
import RegisterUser from "./Admin/RegisterUser";
import Units from "./Admin/pages/Units";
import Enroll from "./Admin/pages/Enroll";
import Pending from "./Admin/pages/Pending";
import Publish from "./Admin/pages/Publish";
import DepartmentsOverview from "./Admin/pages/DepartmentsOverview";

// HOD


// Lecturer
import Assessments from "./Admin/pages/Assessments";
import Grades from "./Admin/pages/Grades";
import Courses from "./pages/lecturers/Courses";
import Dashboard from "./pages/lecturers/Dashboard"
import Gradebook from "./pages/lecturers/Gradebook"
import MissingMarks from "./pages/lecturers/MissingMarks"
import Nortification from "./pages/lecturers/Notifications"
import Profile from "./pages/lecturers/Profile"


// Student (dashboard shell + pages)
import StudentLayout from "./pages/students/dashboard/StudentLayout";
import StudentDashboard from "./pages/students/dashboard/StudentDashboard";
import MissingReport from "./Admin/pages/MissingReport";  // existing page
import HodDashboard from "./components/hod/Dashboard";

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
          <Route path="units" element={<Units />} />
          <Route path="enroll" element={<Enroll />} />
          <Route path="pending" element={<Pending />} />
          <Route path="publish" element={<Publish />} />
          <Route path="overview" element={<DepartmentsOverview />} />
        </Route>


               {/* HoD */}
           <Route path="/hod/pending" element={<Pending />} />
            <Route path="/hod/dashboard" element={<HodDashboard />} />
           <Route path="/hod/publish" element={<Publish />} />

        {/* ===================== LECTURER ===================== */}
        <Route path="/lec/assessments" element={<Assessments />} />
        <Route path="/lec/grades" element={<Grades />} />
        <Route path="/lecturers/courses" element={<Courses/>} />
        <Route path="/lecturers/dashboard" element={<Dashboard/>} />
        <Route path="/lecturers/gradebook" element={<Gradebook/>} />
        <Route path="/lecturers/missingmarks" element={<MissingMarks/>} />
        <Route path="/lecturers/nortification" element={<Nortification/>} />
        <Route path="/lecturers/profile" element={<Profile/>}></Route>

        {/* ===================== STUDENT ===================== */}
        {/* Mount Student layout at /student so children render inside its <Outlet /> */}
        <Route path="/student" element={<StudentLayout />}>
          {/* default -> /student/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<StudentDashboard />} />

          {/* My Grades (primary) */}
          {/* Backward-compat: send /student/viewgrades to /student/grades */}
          <Route path="viewgrades" element={<Navigate to="../grades" replace />} />

          {/* Existing missing report routes */}
          <Route path="report-missing" element={<MissingReport />} />
          <Route path="report" element={<MissingReport />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
