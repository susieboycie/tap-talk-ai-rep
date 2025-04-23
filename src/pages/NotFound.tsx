
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-repgpt-800">
      <div className="text-center">
        <h1 className="text-8xl font-bold mb-4 text-repgpt-400">404</h1>
        <p className="text-2xl text-white mb-6">Oops! Page not found</p>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-repgpt-400 hover:bg-repgpt-500">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
