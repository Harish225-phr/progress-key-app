import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BookOpen,
  FileText,
  ClipboardList,
  MessageSquare,
  LogOut,
  GraduationCap,
  Upload,
} from "lucide-react";

const SubjectTeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalHomework: 0,
    totalMaterials: 0,
    totalTests: 0,
    behaviorNotes: 0,
  });

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "SUBJECT_TEACHER") {
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
        .select("id")
        .eq("user_id", userId)
        .single();

      if (!teacherData) return;

      const [homeworkRes, materialsRes, testsRes, behaviorRes] = await Promise.all([
        supabase
          .from("homework")
          .select("id", { count: "exact" })
          .eq("teacher_id", teacherData.id),
        supabase
          .from("materials")
          .select("id", { count: "exact" })
          .eq("teacher_id", teacherData.id),
        supabase
          .from("tests")
          .select("id", { count: "exact" })
          .eq("teacher_id", teacherData.id),
        supabase
          .from("behavior")
          .select("id", { count: "exact" })
          .eq("teacher_id", teacherData.id),
      ]);

      setStats({
        totalHomework: homeworkRes.count || 0,
        totalMaterials: materialsRes.count || 0,
        totalTests: testsRes.count || 0,
        behaviorNotes: behaviorRes.count || 0,
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
              <p className="text-sm text-muted-foreground">Subject Teacher Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.full_name}</p>
              <p className="text-xs text-muted-foreground">Subject Teacher</p>
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
                Homework Assigned
              </CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalHomework}</div>
              <p className="text-xs text-muted-foreground mt-1">Total assignments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Materials
              </CardTitle>
              <BookOpen className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalMaterials}</div>
              <p className="text-xs text-muted-foreground mt-1">Uploaded resources</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tests Created
              </CardTitle>
              <ClipboardList className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalTests}</div>
              <p className="text-xs text-muted-foreground mt-1">Assessments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Behavior Notes
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.behaviorNotes}</div>
              <p className="text-xs text-muted-foreground mt-1">Student observations</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Upload Study Material</span>
                <span className="text-xs text-muted-foreground">
                  Add PDFs, PPTs, videos
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Assign Homework</span>
                <span className="text-xs text-muted-foreground">
                  Bulk assign to full class
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Create Test</span>
                <span className="text-xs text-muted-foreground">
                  Set up new assessment
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Enter Marks</span>
                <span className="text-xs text-muted-foreground">
                  Record test scores
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Add Behavior Note</span>
                <span className="text-xs text-muted-foreground">
                  Record student behavior
                </span>
              </Button>
              <Button className="h-auto py-4 flex-col items-start" variant="outline">
                <span className="font-semibold mb-1">Daily Topics</span>
                <span className="text-xs text-muted-foreground">
                  "Aaj kya padhaaya"
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>Your Responsibilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Content Management
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Upload learning materials, assign homework, create tests, and enter marks for
                    your subject. Keep students and parents updated with daily teaching topics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Behavior Tracking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add behavior remarks for students to help track their conduct and progress.
                    These notes are visible to class teachers and parents.
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

export default SubjectTeacherDashboard;