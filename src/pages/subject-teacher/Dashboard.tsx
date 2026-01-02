import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  ClipboardList,
  MessageSquare,
  Upload,
  PenLine,
  BarChart3,
} from "lucide-react";
import InstallBanner from "@/components/InstallBanner";

const stats = {
  totalHomework: 12,
  totalMaterials: 28,
  totalTests: 8,
  behaviorNotes: 15,
};

export default function SubjectTeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Install Banner */}
      <InstallBanner storageKey="subject_teacher_install_banner_dismissed" />

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your teaching activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Homework Assigned
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalHomework}</div>
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
            <div className="text-3xl font-bold">{stats.totalMaterials}</div>
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
            <div className="text-3xl font-bold">{stats.totalTests}</div>
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
            <div className="text-3xl font-bold">{stats.behaviorNotes}</div>
            <p className="text-xs text-muted-foreground mt-1">Student observations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/materials">
                <span className="font-semibold mb-1">Upload Study Material</span>
                <span className="text-xs text-muted-foreground">Add PDFs, PPTs, videos</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/homework">
                <span className="font-semibold mb-1">Assign Homework</span>
                <span className="text-xs text-muted-foreground">Bulk assign to full class</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/tests">
                <span className="font-semibold mb-1">Create Test</span>
                <span className="text-xs text-muted-foreground">Set up new assessment</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/marks">
                <span className="font-semibold mb-1">Enter Marks</span>
                <span className="text-xs text-muted-foreground">Record test scores</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/behaviour">
                <span className="font-semibold mb-1">Add Behavior Note</span>
                <span className="text-xs text-muted-foreground">Record student behavior</span>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4 flex-col items-start" variant="outline">
              <Link to="/subject-teacher/daily-topics">
                <span className="font-semibold mb-1">Daily Topics</span>
                <span className="text-xs text-muted-foreground">"Aaj kya padhaaya"</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Responsibilities */}
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
                <h4 className="font-semibold mb-1">Content Management</h4>
                <p className="text-sm text-muted-foreground">
                  Upload learning materials, assign homework, create tests, and enter marks for
                  your subject. Keep students and parents updated with daily teaching topics.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Performance Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor student performance through marks and behavior tracking. Identify students
                  who need extra attention and support their growth.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
