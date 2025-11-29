import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, ClipboardList } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            School Progress Tracking System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete solution for managing student progress, attendance, homework, and
            parent-teacher communication
          </p>
          <Button size="lg" onClick={() => navigate("/login")} className="text-lg px-8 py-6">
            Access Your Dashboard
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                Separate dashboards for admin, teachers, and parents with appropriate permissions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Mark and monitor student attendance with detailed analytics and reports
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Homework & Materials</h3>
              <p className="text-sm text-muted-foreground">
                Upload study materials, assign homework, and track student submissions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Progress Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Track test scores, behavior notes, and overall student performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Roles Section */}
        <div className="bg-card rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">System Features by Role</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-primary">Super Admin</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Manage all teachers & students</li>
                <li>• View school-wide analytics</li>
                <li>• Create announcements</li>
                <li>• Monitor attendance & fees</li>
              </ul>
            </div>
            <div className="p-6 bg-accent/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-accent">Class Teacher</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mark daily attendance</li>
                <li>• Approve leave requests</li>
                <li>• Update fee status</li>
                <li>• View class performance</li>
              </ul>
            </div>
            <div className="p-6 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-primary">Subject Teacher</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Upload study materials</li>
                <li>• Assign homework</li>
                <li>• Create tests & enter marks</li>
                <li>• Add behavior notes</li>
              </ul>
            </div>
            <div className="p-6 bg-accent/5 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-accent">Parent/Student</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View attendance & marks</li>
                <li>• Access homework & materials</li>
                <li>• Submit leave requests</li>
                <li>• Check fee status</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">Ready to get started?</p>
          <Button size="lg" onClick={() => navigate("/login")} variant="outline" className="text-lg px-8 py-6">
            Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
