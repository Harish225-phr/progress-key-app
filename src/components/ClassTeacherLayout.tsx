import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  History,
  FileText,
  DollarSign,
  Megaphone,
  BarChart3,
  LogOut,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const ClassTeacherLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const menuItems = [
    { path: "/class-teacher", icon: LayoutDashboard, label: "Dashboard", end: true },
    { path: "/class-teacher/students", icon: Users, label: "Students" },
    { path: "/class-teacher/mark-attendance", icon: CheckSquare, label: "Mark Attendance" },
    { path: "/class-teacher/attendance-history", icon: History, label: "Attendance History" },
    { path: "/class-teacher/leave-requests", icon: FileText, label: "Leave Requests" },
    { path: "/class-teacher/fee-status", icon: DollarSign, label: "Fee Status" },
    { path: "/class-teacher/announcements", icon: Megaphone, label: "Announcements" },
    { path: "/class-teacher/overview", icon: BarChart3, label: "Class Overview" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card border shadow-sm"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Class Teacher</h2>
              <p className="text-xs text-muted-foreground">{user?.full_name}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">School Progress System</h1>
            <p className="text-sm text-muted-foreground">Class Teacher Portal</p>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ClassTeacherLayout;
