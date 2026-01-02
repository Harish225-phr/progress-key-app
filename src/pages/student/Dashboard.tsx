import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  FileText,
  BookOpen,
  ClipboardList,
  DollarSign,
  Bell,
  MessageSquare,
  Calendar,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Send,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import InstallBanner from "@/components/InstallBanner";

// Dummy data
const attendanceData = [
  { day: "Mon", value: 100 },
  { day: "Tue", value: 100 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 100 },
  { day: "Fri", value: 100 },
  { day: "Sat", value: 100 },
];

const recentHomework = [
  { id: 1, subject: "Mathematics", title: "Algebra Practice Set 5", due: "Today", status: "pending" },
  { id: 2, subject: "Science", title: "Chapter 7 Questions", due: "Tomorrow", status: "pending" },
  { id: 3, subject: "English", title: "Essay Writing", due: "2 days", status: "completed" },
];

const todaysTopics = [
  { subject: "Mathematics", topic: "Quadratic Equations", teacher: "Mr. Sharma" },
  { subject: "Science", topic: "Newton's Laws", teacher: "Mrs. Gupta" },
  { subject: "English", topic: "Shakespearean Sonnets", teacher: "Mr. Khan" },
];

const recentMarks = [
  { test: "Math Weekly Test", marks: 42, maxMarks: 50, percentage: 84 },
  { test: "Science Unit Test", marks: 38, maxMarks: 50, percentage: 76 },
  { test: "English Quiz", marks: 18, maxMarks: 20, percentage: 90 },
];

const behaviourSummary = {
  positive: 8,
  needsImprovement: 2,
  lastNote: { type: "Good", note: "Excellent participation in class discussion" },
};

const announcements = [
  { id: 1, title: "Annual Sports Day", date: "Dec 20, 2024", isSchoolWide: true },
  { id: 2, title: "Class Photo Session", date: "Dec 18, 2024", isSchoolWide: false },
];

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Install Banner */}
      <InstallBanner storageKey="student_dashboard_install_banner_dismissed" />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back!</h1>
        <p className="text-muted-foreground">Here's your academic overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => navigate("/student/attendance")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <Badge variant="secondary" className="text-xs">This Month</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">92%</p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => navigate("/student/homework")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <Badge variant="destructive" className="text-xs">2 Pending</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">Homework Tasks</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => navigate("/student/materials")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="h-8 w-8 text-purple-500" />
              <Badge variant="secondary" className="text-xs">New</Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Study Materials</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
          onClick={() => navigate("/student/tests")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <ClipboardList className="h-8 w-8 text-orange-500" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">83%</p>
            <p className="text-xs text-muted-foreground">Avg. Test Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart Preview */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              This Week's Attendance
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/attendance")}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Homework */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Latest Homework
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/homework")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{hw.title}</p>
                    <p className="text-xs text-muted-foreground">{hw.subject} • Due: {hw.due}</p>
                  </div>
                  <Badge variant={hw.status === "completed" ? "secondary" : "destructive"}>
                    {hw.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Topics */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Today's Topics
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/daily-topics")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysTopics.map((topic, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline">{topic.subject}</Badge>
                    <span className="text-xs text-muted-foreground">{topic.teacher}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{topic.topic}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Marks */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-orange-500" />
                Recent Test Marks
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/tests")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentMarks.map((test, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">{test.test}</p>
                    <Badge variant={test.percentage >= 80 ? "secondary" : "outline"}>
                      {test.percentage}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={test.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {test.marks}/{test.maxMarks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Behaviour Summary */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                Behaviour Summary
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/student/behaviour")}>
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{behaviourSummary.positive}</p>
                <p className="text-xs text-muted-foreground">Positive Notes</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{behaviourSummary.needsImprovement}</p>
                <p className="text-xs text-muted-foreground">Needs Improvement</p>
              </div>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">Latest</Badge>
                <Badge variant="outline" className="text-xs">{behaviourSummary.lastNote.type}</Badge>
              </div>
              <p className="text-sm text-foreground">{behaviourSummary.lastNote.note}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Status & Leave Request */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Fee Status */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all"
          onClick={() => navigate("/student/fees")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Fee Status</p>
                <Badge variant="secondary" className="mt-1">All Paid</Badge>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Leave Request Button */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all bg-primary/5 border-primary/20"
          onClick={() => navigate("/student/leave-request")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Submit Leave Request</p>
                <p className="text-sm text-muted-foreground">Request time off from school</p>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Announcements
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/student/announcements")}>
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    {announcement.isSchoolWide ? (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Bell className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">{announcement.date}</p>
                  </div>
                </div>
                <Badge variant={announcement.isSchoolWide ? "secondary" : "outline"}>
                  {announcement.isSchoolWide ? "School" : "Class"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
