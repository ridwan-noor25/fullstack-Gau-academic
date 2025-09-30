// src/routes/ProtectedRoutes.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext"; // ✅ fixed path

export default function ProtectedRoutes({ children, allowedRoles }) {
  const { isAuthed, role } = useAuth();

  if (!isAuthed) {
    // not logged in → send to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role?.toLowerCase())) {
    // logged in but wrong role → block
    return <Navigate to="/login" replace />;
  }

  return children;
}
