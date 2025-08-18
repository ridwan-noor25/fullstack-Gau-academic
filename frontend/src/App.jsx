// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Student pages
import HeroSection from "./pages/students/HeroSection";
import ViewGrades from "./pages/students/ViewGrades";
import ReportMissingMarks from "./pages/students/ReportMissingMarks";
import Guide from "./pages/students/Guide";

// Auth pages
import ForgotPassword from "./pages/auth/ForgotPassword";
import LoginPage from "./pages/auth/LoginPage";
import ResetPassword from "./pages/auth/ResetPassword";
import SignupPage from "./pages/auth/SignupPage";

// Lecturer pages
import LecturerDashboard from "./pages/lecturers/Dashboard";
import Gradebook from "./pages/lecturers/Gradebook";
import MissingMarks from "./pages/lecturers/MissingMarks";
import Courses from "./pages/lecturers/Courses";
import Notifications from "./pages/lecturers/Notifications";
import Profile from "./pages/lecturers/Profile";

function App() {
  const location = useLocation();
  const isLecturerRoute = location.pathname.startsWith("/lecturer");

  return (
    <>
      {!isLecturerRoute && <Navbar />}

      <Routes>
        {/* Public / Student routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/view-grades" element={<ViewGrades />} />
        <Route path="/report-missing-marks" element={<ReportMissingMarks />} />
        <Route path="/guide" element={<Guide />} />

        {/* Auth */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Lecturer aliases & redirects */}
        <Route path="/lecturers" element={<Navigate to="/lecturer/dashboard" replace />} />
        <Route path="/lecturer" element={<Navigate to="/lecturer/dashboard" replace />} />

        {/* Lecturer routes */}
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer/gradebook" element={<Gradebook />} />
        <Route path="/lecturer/missing-marks" element={<MissingMarks />} />
        <Route path="/lecturer/courses" element={<Courses />} />
        <Route path="/lecturer/notifications" element={<Notifications />} />
        <Route path="/lecturer/profile" element={<Profile />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isLecturerRoute && <Footer />}
    </>
  );
}

export default App;
