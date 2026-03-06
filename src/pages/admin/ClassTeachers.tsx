import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Trash2, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { classTeacherService, type ClassTeacherAssignment, type AssignClassTeacherData } from "@/services/classTeacherService";
import { userService, type User } from "@/services/userService";
import { getClasses, getSectionsByClassId, type SectionResponse } from "@/services/classService";
import { useAcademicYear } from "@/hooks/useAcademicYear";

export default function ClassTeachers() {
  const [assignments, setAssignments] = useState<ClassTeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { list: academicYears, current: currentYear } = useAcademicYear();
  const defaultYear = currentYear?.name ?? currentYear?.id ?? new Date().getFullYear().toString();
  const [formData, setFormData] = useState<AssignClassTeacherData>({
    teacherId: "",
    classId: "",
    sectionId: "",
    academicYear: "",
  });
const [filterAcademicYear, setFilterAcademicYear] = useState<string>("");
  const [filterClassId, setFilterClassId] = useState<string>("");

  useEffect(() => {
    if (defaultYear && !formData.academicYear) {
      setFormData((prev) => ({ ...prev, academicYear: defaultYear }));
    }
  }, [defaultYear]);

  useEffect(() => {
    fetchData();
  }, [filterAcademicYear, filterClassId]);

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
      // Build filter params, excluding "all" values
      const filterParams: Record<string, string> = {};
      if (filterAcademicYear && filterAcademicYear !== "all") {
        filterParams.academicYear = filterAcademicYear;
      }
      if (filterClassId && filterClassId !== "all") {
        filterParams.classId = filterClassId;
      }

      const [assignmentsData, usersData, classesData] = await Promise.all([
        classTeacherService.getAll(Object.keys(filterParams).length > 0 ? filterParams : undefined),
        userService.getAll(),
        getClasses(),
      ]);
      setAssignments(assignmentsData);
      // Filter only teachers from users
      setTeachers(usersData.filter(u => u.role?.toLowerCase() === "teacher"));
      setClasses(classesData.map(c => ({ id: c.id, name: c.name })));
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

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.teacherId) {
      toast.error("Please select a teacher");
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
    if (!formData.academicYear) {
      toast.error("Please select an academic year");
      return;
    }

    // Check if already assigned
    const existing = assignments.find(
      a => a.classId === formData.classId && a.sectionId === formData.sectionId
    );
    if (existing) {
      toast.error("A class teacher is already assigned to this class/section");
      return;
    }

    setIsSubmitting(true);
    try {
      const newAssignment = await classTeacherService.assign(formData);
      
      // Add teacher/class/section names for display
      const teacher = teachers.find(t => t.id === formData.teacherId);
      const cls = classes.find(c => c.id === formData.classId);
      const section = sections.find(s => s.id === formData.sectionId);
      
      const enrichedAssignment = {
        ...newAssignment,
        teacherName: teacher?.name || newAssignment.teacherName,
        className: cls?.name || newAssignment.className,
        sectionName: section?.name || newAssignment.sectionName,
      };
      
      setAssignments(prev => [...prev, enrichedAssignment]);
      toast.success("Class teacher assigned successfully!");
      setDialogOpen(false);
      setFormData({
        teacherId: "",
        classId: "",
        sectionId: "",
        academicYear: defaultYear,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to assign class teacher";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTeacherName = (assignment: ClassTeacherAssignment) => {
    if (assignment.teacherName) return assignment.teacherName;
    const teacher = teachers.find(t => t.id === assignment.teacherId);
    return teacher?.name ?? assignment.teacherId;
  };

  const getClassName = (assignment: ClassTeacherAssignment) => {
    if (assignment.className) return assignment.className;
    const cls = classes.find(c => c.id === assignment.classId);
    return cls?.name ?? assignment.classId;
  };

  const getSectionName = (assignment: ClassTeacherAssignment) => {
    return assignment.sectionName ?? assignment.sectionId;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Teacher Assignments</h1>
          <p className="text-muted-foreground">
            Assign teachers as class teachers for specific class/sections
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Assign Class Teacher
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Class Teacher</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <Label htmlFor="teacherId">Teacher *</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="teacherId">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name} ({teacher.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value, sectionId: "" })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sectionId">Section *</Label>
                <Select
                  value={formData.sectionId}
                  onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                  disabled={isSubmitting || !formData.classId}
                >
                  <SelectTrigger id="sectionId">
                    <SelectValue placeholder={formData.classId ? "Select section" : "Select class first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Select
                  value={formData.academicYear}
                  onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="academicYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((ay) => (
                      <SelectItem key={ay.id} value={ay.name || ay.id}>
                        {ay.name || ay.id}
                      </SelectItem>
                    ))}
                    {academicYears.length === 0 && (
                      <SelectItem value={defaultYear}>{defaultYear}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Class Teacher"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Current Assignments ({assignments.length})
          </CardTitle>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="space-y-1">
              <Label>Academic Year</Label>
<Select value={filterAcademicYear} onValueChange={setFilterAcademicYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent>
<SelectItem value="all">All years</SelectItem>
                  {academicYears.map((ay) => (
                    <SelectItem key={ay.id} value={ay.name || ay.id}>
                      {ay.name || ay.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Class</Label>
<Select value={filterClassId} onValueChange={setFilterClassId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
<SelectItem value="all">All classes</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No class teacher assignments yet.</p>
              <p className="text-sm">Click "Assign Class Teacher" to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">
                      {getTeacherName(assignment)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getClassName(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getSectionName(assignment)}</Badge>
                    </TableCell>
                    <TableCell>{assignment.academicYear}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={loading}
                        onClick={async () => {
                          if (!window.confirm("Remove this class teacher assignment?")) return;
                          try {
                            await classTeacherService.delete(assignment.id);
                            setAssignments((prev) => prev.filter((a) => a.id !== assignment.id));
                            toast.success("Assignment removed");
                          } catch {
                            toast.error("Failed to remove assignment");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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
