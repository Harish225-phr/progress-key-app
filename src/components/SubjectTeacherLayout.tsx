import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardList,
  PenLine,
  MessageSquare,
  BookOpen,
  BarChart3,
  LogOut,
  GraduationCap,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", url: "/subject-teacher", icon: LayoutDashboard },
  { title: "Upload Study Material", url: "/subject-teacher/materials", icon: Upload },
  { title: "Assign Homework", url: "/subject-teacher/homework", icon: FileText },
  { title: "Create Test", url: "/subject-teacher/tests", icon: ClipboardList },
  { title: "Enter Marks", url: "/subject-teacher/marks", icon: PenLine },
  { title: "Behaviour Notes", url: "/subject-teacher/behaviour", icon: MessageSquare },
  { title: "Daily Topics", url: "/subject-teacher/daily-topics", icon: BookOpen },
  { title: "Student Performance", url: "/subject-teacher/performance", icon: BarChart3 },
];

export default function SubjectTeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

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
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Subject Teacher</h2>
                <p className="text-xs text-muted-foreground">{user.full_name}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-bold text-foreground">School Progress System</h1>
                <p className="text-sm text-muted-foreground">Subject Teacher Panel</p>
              </div>
            </div>
          </header>
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
