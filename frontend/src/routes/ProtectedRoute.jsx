import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token, loadingAuth } = useAuth();

  if (loadingAuth) return null;

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
