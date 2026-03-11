import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Clock,
  Activity,
} from "lucide-react";
import InstallBanner from "@/components/InstallBanner";
import { toast } from "sonner";
import { dashboardService } from "@/services/dashboardService";
import { attendanceService } from "@/services/attendanceService";
import { classTeacherService } from "@/services/classTeacherService";
import { studentService } from "@/services/studentService";
import { feeService } from "@/services/feeService";

interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  feesPending: number;
  feesCollected: number;
  attendanceRate: number;
  myClasses: any[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeaves: 0,
    feesPending: 0,
    feesCollected: 0,
    attendanceRate: 0,
    myClasses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get teacher's assigned classes
      const myClasses = await classTeacherService.getMyClasses();
      
      if (myClasses.length === 0) {
        setStats(prev => ({ ...prev, myClasses: [], totalStudents: 0 }));
        setLoading(false);
        return;
      }

      const assignment = myClasses[0];
      
      // Get students for assigned class
      const allStudents = await studentService.getAll();
      const myStudents = allStudents.filter(
        s => s.classId === assignment.classId && s.sectionId === assignment.sectionId
      );

      // Get today's attendance
      const today = new Date().toISOString().split('T')[0];
      let presentCount = 0;
      let absentCount = 0;

      try {
        const attendanceSummary = await attendanceService.getClassSummary({
          academicYearId: assignment.academicYearId,
          classId: assignment.classId,
          sectionId: assignment.sectionId,
          date: today,
        });
        presentCount = attendanceSummary.present;
        absentCount = attendanceSummary.absent;
      } catch (error) {
        // If no attendance marked for today, show 0
        console.log("No attendance marked for today");
      }

      // Calculate attendance rate
      const attendanceRate = myStudents.length > 0 
        ? Math.round((presentCount / myStudents.length) * 100) 
        : 0;

      // Mock fees data (you can implement real fee service integration)
      const feesPending = Math.floor(myStudents.length * 0.2); // 20% pending
      const feesCollected = myStudents.length - feesPending;

      setStats({
        totalStudents: myStudents.length,
        presentToday: presentCount,
        absentToday: absentCount,
        pendingLeaves: 3, // Mock data - implement real leave requests
        feesPending,
        feesCollected,
        attendanceRate,
        myClasses,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (stats.myClasses.length === 0) {
    return (
      <div className="space-y-6">
        <InstallBanner storageKey="class_teacher_install_banner_dismissed" />
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Class Assignment</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You are not currently assigned as a class teacher to any class/section.
              Please contact your school administrator for assignment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Install Banner */}
      <InstallBanner storageKey="class_teacher_install_banner_dismissed" />

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            {stats.myClasses.length > 0 && 
              `Class ${stats.myClasses[0]?.className || 'N/A'} - Section ${stats.myClasses[0]?.sectionName || 'N/A'}`
            }
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString("en-US", { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/class-teacher/students")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">In your class</p>
            <div className="mt-2">
              <div className="text-xs text-green-600 font-medium">Active enrollment</div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/class-teacher/mark-attendance")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Present Today
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.presentToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Students marked present</p>
            <div className="mt-2">
              <div className="text-xs font-medium">
                Attendance: {stats.attendanceRate}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/class-teacher/fee-status")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fees Overview
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.feesCollected}</div>
            <p className="text-xs text-muted-foreground mt-1">Collected / {stats.totalStudents}</p>
            <div className="mt-2">
              <div className="text-xs text-orange-600 font-medium">
                {stats.feesPending} pending
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/class-teacher/leave-requests")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground mt-1">Leave requests</p>
            <div className="mt-2">
              <div className="text-xs text-muted-foreground font-medium">Awaiting approval</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Today's Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/mark-attendance")}
            >
              <CheckCircle className="h-6 w-6 mb-2 text-green-600" />
              <span className="font-semibold mb-1">Mark Attendance</span>
              <span className="text-xs text-muted-foreground">Record today's attendance</span>
            </Button>
            
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/students")}
            >
              <Users className="h-6 w-6 mb-2 text-blue-600" />
              <span className="font-semibold mb-1">View Students</span>
              <span className="text-xs text-muted-foreground">Manage class students</span>
            </Button>
            
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/leave-requests")}
            >
              <FileText className="h-6 w-6 mb-2 text-orange-600" />
              <span className="font-semibold mb-1">Review Leaves</span>
              <span className="text-xs text-muted-foreground">
                {stats.pendingLeaves} pending requests
              </span>
            </Button>
            
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/fee-status")}
            >
              <DollarSign className="h-6 w-6 mb-2 text-purple-600" />
              <span className="font-semibold mb-1">Fee Status</span>
              <span className="text-xs text-muted-foreground">Track payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Class Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Attendance Rate</p>
                    <p className="text-sm text-muted-foreground">This month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
                  <p className="text-xs text-muted-foreground">Good</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Class Strength</p>
                    <p className="text-sm text-muted-foreground">Total enrolled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Attendance marked</p>
                  <p className="text-xs text-muted-foreground">Today at 9:30 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New student enrolled</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 2:15 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave request received</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
