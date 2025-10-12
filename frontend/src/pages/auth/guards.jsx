// src/routes/guards.jsx
import { Navigate, useLocation } from "react-router-dom";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    return JSON.parse(atob(base64Url));
  } catch {
    return {};
  }
};

const getAuth = () => {
  const token = localStorage.getItem("token");
  const student = JSON.parse(localStorage.getItem("student") || "null");
  const payload = token ? parseJwt(token) : {};
  // prefer explicit student.role, else JWT role/scope/claim, else null
  const role =
    student?.role ||
    payload?.role ||
    payload?.scope ||
    payload?.claims?.role ||
    null;

  return { authed: !!(token || student), role, user: student, token };
};

export function RequireAuth({ children }) {
  const location = useLocation();
  const { authed } = getAuth();
  if (!authed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
}

export function RequireRole({ roles = [], children }) {
  const location = useLocation();
  const { authed, role } = getAuth();

  if (!authed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
