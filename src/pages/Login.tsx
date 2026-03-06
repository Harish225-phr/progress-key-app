import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { login, setAuthTokens } from "@/services/authService";
import { getErrorMessage } from "@/api/errors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in (accessToken or legacy token)
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("accessToken") ?? sessionStorage.getItem("token");
    
    if (user && token) {
      try {
        const userData = JSON.parse(user);
        const role = userData.role?.toLowerCase();
        
        // Redirect to appropriate dashboard based on role
        switch (role) {
          case "school_admin":
          case "admin":
            navigate("/admin", { replace: true });
            break;
          case "teacher":
          case "class_teacher":
            navigate("/class-teacher", { replace: true });
            break;
          case "subject_teacher":
            navigate("/subject-teacher", { replace: true });
            break;
          case "student":
          case "parent":
          case "student_parent":
            navigate("/student", { replace: true });
            break;
          default:
            // Unknown role - stay on login, clear invalid session
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("token");
            break;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const responseData = await login({ email, password });

      // Store accessToken, refreshToken, and user (use token as legacy fallback)
      setAuthTokens({
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
        token: responseData.token,
        user: responseData.user,
      });

      toast.success("Login successful!");

      // Route based on role
      const role = responseData.user?.role?.toLowerCase();
      switch (role) {
        case "school_admin":
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
        case "class_teacher":
          navigate("/class-teacher");
          break;
        case "subject_teacher":
          navigate("/subject-teacher");
          break;
        case "student":
        case "parent":
        case "student_parent":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Network error. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">School Progress System</CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              New school?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register School
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;