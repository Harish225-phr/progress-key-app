import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  LogOut,
  GraduationCap,
  Calendar,
} from "lucide-react";

const ClassTeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    pendingLeaves: 0,
    feesPending: 0,
  });

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "CLASS_TEACHER") {
      navigate("/login");
      return;
    }
    setUser(parsedUser);
    loadStats(parsedUser.id);
  }, [navigate]);

  const loadStats = async (userId: string) => {
    try {
      // Get teacher info
      const { data: teacherData } = await supabase
        .from("teachers")
        .select("id, assigned_class_id, assigned_section_id")
        .eq("user_id", userId)
        .single();

      if (!teacherData) return;

      // Get students count
      const { count: studentsCount } = await supabase
        .from("students")
        .select("id", { count: "exact" })
        .eq("class_id", teacherData.assigned_class_id)
        .eq("section_id", teacherData.assigned_section_id);

      // Get today's attendance
      const today = new Date().toISOString().split("T")[0];
      const { count: presentCount } = await supabase
        .from("attendance")
        .select("id", { count: "exact" })
        .eq("date", today)
        .eq("is_present", true);

      // Get pending leaves
      const { count: leavesCount } = await supabase
        .from("leave_requests")
        .select("id", { count: "exact" })
        .eq("status", "PENDING");

      // Get fees pending
      const { count: feesCount } = await supabase
        .from("fees")
        .select("id", { count: "exact" })
        .eq("status", "PENDING");

      setStats({
        totalStudents: studentsCount || 0,
        presentToday: presentCount || 0,
        pendingLeaves: leavesCount || 0,
        feesPending: feesCount || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">School Progress System</h1>
              <p className="text-sm text-muted-foreground">Class Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">Class Teacher</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">In your class</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Present Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.presentToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Students marked present</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Leaves
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.pendingLeaves}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fees Pending
              </CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.feesPending}</div>
              <p className="text-xs text-muted-foreground mt-1">Outstanding payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Mark Attendance</span>
                <span className="text-xs text-muted-foreground">Record today's attendance</span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Review Leave Requests</span>
                <span className="text-xs text-muted-foreground">
                  {stats.pendingLeaves} pending requests
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Update Fee Status</span>
                <span className="text-xs text-muted-foreground">Manage fee payments</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Class Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Class Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Attendance Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You can mark daily attendance, view attendance records, and approve leave
                    requests from students. Your attendance data helps monitor student regularity.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Fee Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    View fee status for all students in your class and update payment records when
                    fees are received. Keep track of outstanding payments.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ClassTeacherDashboard;