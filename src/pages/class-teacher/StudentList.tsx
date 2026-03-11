import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Eye, Plus, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { studentService, type Student, type StudentAdmissionData } from "@/services/studentService";
import { classTeacherService, type ClassTeacherAssignment } from "@/services/classTeacherService";

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [myAssignment, setMyAssignment] = useState<ClassTeacherAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<StudentAdmissionData, "classId" | "sectionId" | "schoolId" | "admissionNumber" | "admissionDate" | "isActive" | "createdAt" | "updatedAt">>({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    address: "",
    bloodGroup: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // First get teacher's assigned class/section
      const assignments = await classTeacherService.getMyClasses();
      
      if (assignments.length === 0) {
        setLoading(false);
        return;
      }
      
      // Use first assignment (teacher is typically assigned to one class/section)
      const assignment = assignments[0];
      setMyAssignment(assignment);

      // Fetch students from admission API (backend already filters by teacher's assignment)
      const studentsData = await studentService.getAll();
      
      setStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch student data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!myAssignment) {
      toast.error("You are not assigned to any class");
      return;
    }

    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const studentData: StudentAdmissionData = {
        ...formData,
        admissionNumber: `ADM-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        classId: myAssignment.classId,
        sectionId: myAssignment.sectionId,
        schoolId: myAssignment.schoolId || "",
        admissionDate: new Date().toISOString(),
        isActive: true,
      };
      
      const newStudent = await studentService.admitStudent(studentData);
      setStudents(prev => [...prev, newStudent]);
      toast.success("Student added successfully!");
      setDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "",
        address: "",
        bloodGroup: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add student";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = student.name.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Not assigned message
  if (!loading && !myAssignment) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">View and manage students</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Not Assigned</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You are not currently assigned as a class teacher to any class/section.
              Please contact your school administrator for assignment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">
            {myAssignment ? (
              <>Class {myAssignment.className || myAssignment.classId} - Section {myAssignment.sectionName || myAssignment.sectionId}</>
            ) : (
              "View and manage students"
            )}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!myAssignment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              {myAssignment && (
                <p className="text-sm text-muted-foreground">
                  Adding to Class {myAssignment.className || myAssignment.classId} - Section {myAssignment.sectionName || myAssignment.sectionId}
                </p>
              )}
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value as "Male" | "Female" | "Other" })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    placeholder="e.g., B+"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Student...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No students found for your assigned class.</p>
              <p className="text-sm mt-2">Debug: Total students loaded: {students.length}</p>
              <p className="text-sm">Debug: Filtered students: {filteredStudents.length}</p>
              <p className="text-xs mt-2">Check browser console for detailed debugging info.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admission No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.admissionNumber}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.dob ? new Date(student.dob).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>{student.parentName || "-"}</TableCell>
                    <TableCell>{student.parentName ? "-" : "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/class-teacher/students/${student.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
