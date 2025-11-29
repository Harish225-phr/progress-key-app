import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Query the users table to verify credentials
      const { data: userData, error: queryError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password_hash", password)
        .single();

      if (queryError || !userData) {
        toast.error("Invalid email or password");
        setLoading(false);
        return;
      }

      // Store user data in session storage for role-based routing
      sessionStorage.setItem("user", JSON.stringify(userData));

      toast.success("Login successful!");

      // Route based on role
      switch (userData.role) {
        case "SUPER_ADMIN":
          navigate("/admin");
          break;
        case "CLASS_TEACHER":
          navigate("/class-teacher");
          break;
        case "SUBJECT_TEACHER":
          navigate("/subject-teacher");
          break;
        case "STUDENT_PARENT":
          navigate("/student");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      toast.error("An error occurred during login");
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

          <div className="mt-8 p-4 bg-muted rounded-lg space-y-2 text-sm">
            <p className="font-semibold text-foreground">Demo Credentials:</p>
            <div className="space-y-1 text-muted-foreground">
              <p>🔹 Super Admin: superadmin@gmail.com / abc123</p>
              <p>🔹 Class Teacher: classteacher@gmail.com / abc123</p>
              <p>🔹 Subject Teacher: subjectteacher@gmail.com / abc123</p>
              <p>🔹 Parent/Student: parentchild@gmail.com / abc123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;