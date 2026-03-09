import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Eye,
  Download,
  Bell,
  Star,
  Target,
  Award,
  FileText,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { parentService, type ParentDashboard, type ParentProfile } from "@/services/parentService";

export default function ParentDashboard() {
  const [dashboard, setDashboard] = useState<ParentDashboard | null>(null);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboardData, profileData] = await Promise.all([
          parentService.getDashboard(),
          parentService.getProfile()
        ]);
        
        setDashboard(dashboardData);
        setProfile(profileData);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50";
    if (percentage >= 75) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getFeeStatusColor = (status: number) => {
    if (status === 0) return "text-green-600 bg-green-50";
    if (status <= 25) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "exam": return <FileText className="h-4 w-4" />;
      case "holiday": return <Calendar className="h-4 w-4" />;
      case "meeting": return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboard || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile.userId.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.userId.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{profile.userId.phone || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Occupation</p>
                <p className="font-medium">{profile.occupation || "Not provided"}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">Children:</span>
            <Badge variant="outline">{profile.children.length} students</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Children Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboard.children.map((child) => (
          <Card key={child._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{child.name}</CardTitle>
                <Badge variant="outline">{child.admissionNumber}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {child.className} - {child.sectionName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Attendance Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance</span>
                  <Badge className={getAttendanceColor(child.attendanceStats.attendancePercentage)}>
                    {child.attendanceStats.attendancePercentage}%
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-green-600 font-medium">{child.attendanceStats.presentDays}</p>
                    <p className="text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-600 font-medium">{child.attendanceStats.absentDays}</p>
                    <p className="text-muted-foreground">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-600 font-medium">{child.attendanceStats.lateDays}</p>
                    <p className="text-muted-foreground">Late</p>
                  </div>
                </div>
              </div>

              {/* Fee Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Fees</span>
                  <Badge className={getFeeStatusColor(child.feeStats.pendingFees)}>
                    {child.feeStats.pendingFees > 0 ? "Pending" : "Paid"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Total:</span>
                    <span>₹{child.feeStats.totalFees}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Paid:</span>
                    <span className="text-green-600">₹{child.feeStats.paidFees}</span>
                  </div>
                  {child.feeStats.pendingFees > 0 && (
                    <div className="flex justify-between text-xs">
                      <span>Pending:</span>
                      <span className="text-red-600">₹{child.feeStats.pendingFees}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Academics</span>
                  <Badge variant="outline">
                    {child.academicStats.averageMarks.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  <span>{child.academicStats.totalSubjects} subjects</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1">
                  <ChevronRight className="h-3 w-3 mr-1" />
                  More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getEventTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {event.type}
                  </Badge>
                </div>
              ))}
              {dashboard.upcomingEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming events
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.recentAnnouncements.map((announcement, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{announcement.title}</h4>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                </div>
              ))}
              {dashboard.recentAnnouncements.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No recent announcements
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm">Pay Fees</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Leave Request</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Contact School</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
