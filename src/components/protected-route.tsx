
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-repgpt-900">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold text-white mb-2">RepGPT</div>
          <div className="text-white text-opacity-70 mb-4">Loading your AI assistant...</div>
          <div className="w-16 h-1 bg-repgpt-400 rounded-full overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-white animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
