import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded credentials - NO API calls
    const hardcodedUsers = [
      { email: "superadmin@gmail.com", password: "abc123", role: "SUPER_ADMIN", full_name: "Super Admin" },
      { email: "classteacher@gmail.com", password: "abc123", role: "CLASS_TEACHER", full_name: "Class Teacher" },
      { email: "subjectteacher@gmail.com", password: "abc123", role: "SUBJECT_TEACHER", full_name: "Subject Teacher" },
      { email: "parentchild@gmail.com", password: "abc123", role: "STUDENT_PARENT", full_name: "Parent/Student" },
    ];

    // Find matching user
    const user = hardcodedUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      toast.error("Invalid email or password");
      setLoading(false);
      return;
    }

    // Store user data in session storage for role-based routing
    sessionStorage.setItem("user", JSON.stringify(user));

    toast.success("Login successful!");

    // Route based on role
    switch (user.role) {
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

    setLoading(false);
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