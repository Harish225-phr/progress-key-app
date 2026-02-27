import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  UserCog,
  Link2,
  CalendarCheck,
  FileText,
  TrendingUp,
  FolderOpen,
  ClipboardList,
  Megaphone,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Students", path: "/admin/students" },
  { icon: BookOpen, label: "Classes & Sections", path: "/admin/classes" },
  { icon: GraduationCap, label: "Subjects", path: "/admin/subjects" },
  { icon: UserCog, label: "Teachers", path: "/admin/teachers" },
  { icon: Link2, label: "Teacher Mapping", path: "/admin/mapping" },
  { icon: CalendarCheck, label: "Attendance Reports", path: "/admin/attendance" },
  { icon: FileText, label: "Test/Marks Reports", path: "/admin/marks" },
  { icon: TrendingUp, label: "Behaviour Reports", path: "/admin/behaviour" },
  { icon: FolderOpen, label: "Learning Materials", path: "/admin/materials" },
  { icon: ClipboardList, label: "Homework", path: "/admin/homework" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: DollarSign, label: "Fees Analytics", path: "/admin/fees" },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Super Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn("w-full justify-start gap-3", !sidebarOpen && "justify-center")}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
