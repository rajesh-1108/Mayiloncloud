import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AuthRoute({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/auth" />;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" />;

  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" />;
  }

  return children;
}

export function SuperAdminRoute({ children }) {
  const { user } = useAuth();
  return user?.role === "superadmin"
    ? children
    : <Navigate to="/" />;
}
