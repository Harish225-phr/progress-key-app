import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAcademicYear } from "@/hooks/useAcademicYear";
import AcademicYearBanner from "@/components/AcademicYearBanner";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  UserCog,
  Link2,
  CalendarCheck,
  CalendarRange,
  FileText,
  TrendingUp,
  FolderOpen,
  ClipboardList,
  Megaphone,
  DollarSign,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/services/authService";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: CalendarRange, label: "Academic Year", path: "/admin/academic-years" },
  { 
    icon: Users, 
    label: "User Management", 
    path: "/admin/users",
    children: [
      { icon: UserCog, label: "Admins", path: "/admin/users?role=admin" },
      { icon: UserCog, label: "Teachers", path: "/admin/users?role=teacher" },
      { icon: UserCog, label: "Parents", path: "/admin/users?role=parent" },
    ]
  },
  { 
    icon: Users, 
    label: "Student Management", 
    path: "/admin/students",
    children: [
      { icon: Users, label: "Student Admission", path: "/admin/students/admission" },
      { icon: Users, label: "Student List", path: "/admin/students" },
    ]
  },
  { icon: BookOpen, label: "Classes & Sections", path: "/admin/classes" },
  { icon: GraduationCap, label: "Subjects", path: "/admin/subjects" },
  { icon: UserCog, label: "Teachers", path: "/admin/teachers" },
  { icon: Link2, label: "Teacher Mapping", path: "/admin/mapping" },
  { icon: UserCog, label: "Class Teachers", path: "/admin/class-teachers" },
  { icon: CalendarCheck, label: "Attendance Reports", path: "/admin/attendance" },
  { icon: FileText, label: "Test/Marks Reports", path: "/admin/marks" },
  { icon: TrendingUp, label: "Behaviour Reports", path: "/admin/behaviour" },
  { icon: FolderOpen, label: "Learning Materials", path: "/admin/materials" },
  { icon: ClipboardList, label: "Homework", path: "/admin/homework" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: DollarSign, label: "Fees Analytics", path: "/admin/fees" },
  { icon: FileText, label: "Audit Logs", path: "/admin/audit-logs" },
];

export default function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { current, loading } = useAcademicYear({ fetchListOnMount: false });

  // Debug: Log menu items
  console.log("🔍 SuperAdmin Menu Items:", menuItems);

  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const isExpanded = (path: string) => expandedItems.includes(path);

  const handleLogout = async () => {
    await logout();
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
            <div key={item.path}>
              {/* Parent Menu Item */}
              <NavLink
                to={item.children ? item.path : item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                  )
                }
                onClick={() => {
                  if (item.children) {
                    toggleExpanded(item.path);
                  }
                }}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.children && (
                      isExpanded(item.path) ? (
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      ) : (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )
                    )}
                  </>
                )}
              </NavLink>

              {/* Child Menu Items */}
              {item.children && sidebarOpen && isExpanded(item.path) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                        )
                      }
                    >
                      <child.icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{child.label}</span>
                      )}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
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
        {!loading && <AcademicYearBanner noCurrentYear={!current} />}
        <Outlet />
      </main>
    </div>
  );
}
