// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const authed = Boolean(
    localStorage.getItem("token") || localStorage.getItem("student")
  );
  return authed ? children : <Navigate to="/login" replace />;
}
