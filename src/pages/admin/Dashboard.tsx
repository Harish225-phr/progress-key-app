import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  Megaphone,
  CalendarCheck,
  TrendingUp,
  FileText,
  DollarSign,
  ArrowRight,
} from "lucide-react";

const stats = [
  { title: "Total Students", value: "165", icon: Users, link: "/admin/students", color: "text-blue-600" },
  { title: "Total Teachers", value: "24", icon: GraduationCap, link: "/admin/teachers", color: "text-purple-600" },
  { title: "Active Classes", value: "12", icon: BookOpen, link: "/admin/classes", color: "text-green-600" },
  { title: "Announcements", value: "8", icon: Megaphone, link: "/admin/announcements", color: "text-orange-600" },
  { title: "Attendance Rate", value: "92.5%", icon: CalendarCheck, link: "/admin/attendance", color: "text-cyan-600" },
  { title: "Average Marks", value: "85.3%", icon: TrendingUp, link: "/admin/marks", color: "text-pink-600" },
  { title: "Learning Materials", value: "247", icon: FileText, link: "/admin/materials", color: "text-indigo-600" },
  { title: "Pending Fees", value: "2", icon: DollarSign, link: "/admin/fees", color: "text-red-600" },
];

const recentActivities = [
  { type: "Student", action: "New student enrolled", detail: "John Doe - Class 10-A", time: "2 hours ago" },
  { type: "Teacher", action: "Teacher assignment updated", detail: "Dr. Smith assigned to Physics", time: "5 hours ago" },
  { type: "Announcement", action: "New announcement posted", detail: "Annual Sports Day scheduled", time: "1 day ago" },
  { type: "Fees", action: "Fee payment received", detail: "Sarah Johnson - ₹15,000", time: "1 day ago" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the school management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  View details
                  <ArrowRight className="h-3 w-3 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/students">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Students
              </Button>
            </Link>
            <Link to="/admin/teachers">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Teachers
              </Button>
            </Link>
            <Link to="/admin/mapping">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Teacher Mapping
              </Button>
            </Link>
            <Link to="/admin/announcements">
              <Button variant="outline" className="w-full justify-start">
                <Megaphone className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </Link>
            <Link to="/admin/fees">
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                View Fee Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Academic Year</p>
              <p className="font-medium">2024-2025</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Term</p>
              <p className="font-medium">Term 2</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <p className="font-medium">All Systems Operational</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
