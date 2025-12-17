import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  GraduationCap,
  Home,
  Calendar,
  FileText,
  BookOpen,
  ClipboardList,
  MessageSquare,
  BookMarked,
  Bell,
  Send,
  DollarSign,
  LogOut,
  Menu,
  X,
  Download,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { label: "Dashboard", path: "/student", icon: Home },
  { label: "Attendance", path: "/student/attendance", icon: Calendar },
  { label: "Homework", path: "/student/homework", icon: FileText },
  { label: "Study Materials", path: "/student/materials", icon: BookOpen },
  { label: "Tests & Marks", path: "/student/tests", icon: ClipboardList },
  { label: "Behaviour Notes", path: "/student/behaviour", icon: MessageSquare },
  { label: "Daily Topics", path: "/student/daily-topics", icon: BookMarked },
  { label: "Announcements", path: "/student/announcements", icon: Bell },
  { label: "Leave Request", path: "/student/leave-request", icon: Send },
  { label: "Fees", path: "/student/fees", icon: DollarSign },
];

const StudentParentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "STUDENT_PARENT") {
      navigate("/login");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallButton(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("To install: Use browser menu → Add to Home Screen");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      toast.success("App installed successfully!");
      setShowInstallButton(false);
    }
    setDeferredPrompt(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Mobile Header */}
      <header className="lg:hidden bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-foreground">School App</span>
          </div>
          <div className="flex items-center gap-2">
            {showInstallButton && (
              <Button variant="outline" size="icon" onClick={handleInstallClick}>
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-bold text-foreground">School App</h1>
                  <p className="text-xs text-muted-foreground">Parent Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border bg-muted/30">
            <p className="font-medium text-foreground">{user.full_name}</p>
            <p className="text-xs text-muted-foreground">Student/Parent Account</p>
          </div>

          {/* Install App Section */}
          <div className="p-4 border-b border-border">
            {showInstallButton ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleInstallClick}
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => navigate("/install")}
              >
                <Download className="h-4 w-4 mr-2" />
                Installation Guide
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/student"}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                    activeClassName="bg-primary/10 text-primary font-medium"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 safe-area-inset-bottom">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/student"}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary bg-primary/10"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 truncate">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default StudentParentLayout;
