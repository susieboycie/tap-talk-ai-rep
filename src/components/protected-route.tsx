
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // You might want to add a loading spinner or skeleton here
    return (
      <div className="min-h-screen flex items-center justify-center bg-repgpt-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
