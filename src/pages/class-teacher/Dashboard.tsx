import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Users,
  CheckCircle,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";
import InstallBanner from "@/components/InstallBanner";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = {
    totalStudents: 42,
    presentToday: 38,
    pendingLeaves: 3,
    feesPending: 5,
  };

  return (
    <div className="space-y-6">
      {/* Install Banner */}
      <InstallBanner storageKey="class_teacher_install_banner_dismissed" />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/mark-attendance")}
            >
              <span className="font-semibold mb-1">Mark Attendance</span>
              <span className="text-xs text-muted-foreground">Record today's attendance</span>
            </Button>
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/leave-requests")}
            >
              <span className="font-semibold mb-1">Review Leave Requests</span>
              <span className="text-xs text-muted-foreground">
                {stats.pendingLeaves} pending requests
              </span>
            </Button>
            <Button
              className="h-auto py-4 flex-col items-start"
              variant="outline"
              onClick={() => navigate("/class-teacher/fee-status")}
            >
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
    </div>
  );
};

export default Dashboard;
