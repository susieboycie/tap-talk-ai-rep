
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-repgpt-900 p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-repgpt-400 rounded-md p-2">
              <BarChart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">RepGPT AI</h1>
          </div>
        </div>
        
        <Card className="border-repgpt-700 bg-repgpt-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-repgpt-700 border-repgpt-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-repgpt-700 border-repgpt-600 text-white"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-repgpt-400 hover:bg-repgpt-500 text-white"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              
              <div className="text-center text-sm text-gray-400 mt-4">
                <p>Demo credentials:</p>
                <p>Email: demo@repgpt.com | Password: password</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
