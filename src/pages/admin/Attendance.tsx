import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { attendanceService, type Attendance, type AttendanceData, type AttendanceStatus } from "@/services/attendanceService";
import { studentService, type Student } from "@/services/studentService";
import { getClasses } from "@/services/classService";
import { getSectionsByClassId, type SectionResponse } from "@/services/classService";
import { subjectService, type Subject } from "@/services/subjectService";

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AttendanceData>({
    studentId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      fetchSections(formData.classId);
    } else {
      setSections([]);
      setFormData(prev => ({ ...prev, sectionId: "" }));
    }
  }, [formData.classId]);

  const fetchData = async () => {
    try {
      const [attendanceData, studentsData, classesData, subjectsData] = await Promise.all([
        attendanceService.getAll(),
        studentService.getAll(),
        getClasses(),
        subjectService.getAll(),
      ]);
      setAttendanceRecords(attendanceData);
      setStudents(studentsData);
      setClasses(classesData.map(c => ({ id: c.id, name: c.name })));
      setSubjects(subjectsData);
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (classId: string) => {
    try {
      const sectionsData = await getSectionsByClassId(classId);
      setSections(sectionsData);
    } catch {
      toast.error("Failed to fetch sections");
    }
  };

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId) {
      toast.error("Please select a student");
      return;
    }
    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }
    if (!formData.sectionId) {
      toast.error("Please select a section");
      return;
    }
    if (!formData.subjectId) {
      toast.error("Please select a subject");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }

    setIsSubmitting(true);
    try {
      const newAttendance = await attendanceService.create(formData);
      setAttendanceRecords(prev => [...prev, newAttendance]);
      toast.success("Attendance marked successfully!");
      setDialogOpen(false);
      setFormData({
        studentId: "",
        classId: "",
        sectionId: "",
        subjectId: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark attendance";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAttendance = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await attendanceService.delete(id);
        setAttendanceRecords(prev => prev.filter(a => a.id !== id));
        toast.success("Attendance record deleted!");
      } catch {
        toast.error("Failed to delete attendance");
      }
    }
  };

  const getStudentName = (record: Attendance) => {
    if (record.studentName) return record.studentName;
    const student = students.find(s => s.id === record.studentId);
    return student ? `${student.firstName} ${student.lastName}` : record.studentId;
  };

  const getClassName = (record: Attendance) => {
    if (record.className) return record.className;
    const cls = classes.find(c => c.id === record.classId);
    return cls?.name ?? record.classId;
  };

  const getSectionName = (record: Attendance) => {
    if (record.sectionName) return record.sectionName;
    return record.sectionId;
  };

  const getSubjectName = (record: Attendance) => {
    if (record.subjectName) return record.subjectName;
    const subject = subjects.find(s => s.id === record.subjectId);
    return subject?.name ?? record.subjectId;
  };
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Reports</h1>
        <p className="text-muted-foreground">View attendance records across all classes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground mt-1">Out of 165 students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">17</div>
            <p className="text-xs text-muted-foreground mt-1">Requires follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89.7%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="relative">
                <Input type="date" defaultValue="2024-01-15" />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Class-Section</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Overall %</TableHead>
              </TableRow>
            </TableHeader>
<TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{getStudentName(record)}</TableCell>
                  <TableCell>{getClassName(record)} - {getSectionName(record)}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "Present" ? "default" : "destructive"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
