import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SuperAdminLayout from "./components/SuperAdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Classes from "./pages/admin/Classes";
import Subjects from "./pages/admin/Subjects";
import Teachers from "./pages/admin/Teachers";
import Mapping from "./pages/admin/Mapping";
import Attendance from "./pages/admin/Attendance";
import Marks from "./pages/admin/Marks";
import Behaviour from "./pages/admin/Behaviour";
import Materials from "./pages/admin/Materials";
import Homework from "./pages/admin/Homework";
import Announcements from "./pages/admin/Announcements";
import Fees from "./pages/admin/Fees";
import ClassTeacherDashboard from "./pages/ClassTeacherDashboard";
import SubjectTeacherDashboard from "./pages/SubjectTeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Super Admin Routes with Layout */}
          <Route path="/admin" element={<SuperAdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="classes" element={<Classes />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="mapping" element={<Mapping />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="marks" element={<Marks />} />
            <Route path="behaviour" element={<Behaviour />} />
            <Route path="materials" element={<Materials />} />
            <Route path="homework" element={<Homework />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="fees" element={<Fees />} />
          </Route>

          <Route path="/class-teacher" element={<ClassTeacherDashboard />} />
          <Route path="/subject-teacher" element={<SubjectTeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
