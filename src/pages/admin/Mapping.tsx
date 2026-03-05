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
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { teacherAssignmentService, type TeacherAssignment, type TeacherAssignmentData } from "@/services/teacherAssignmentService";
import { userService, type User } from "@/services/userService";
import { getClasses } from "@/services/classService";
import { getSectionsByClassId, type SectionResponse } from "@/services/classService";
import { subjectService, type Subject } from "@/services/subjectService";

export default function Mapping() {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TeacherAssignmentData>({
    teacherId: "",
    classId: "",
    sectionId: "",
    subjectId: "",
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
      const [assignmentsData, usersData, classesData, subjectsData] = await Promise.all([
        teacherAssignmentService.getAll(),
        userService.getAll(),
        getClasses(),
        subjectService.getAll(),
      ]);
      setAssignments(assignmentsData);
      // Filter only teachers from users
      setTeachers(usersData.filter(u => u.role === "teacher" || u.role === "Teacher"));
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

  const handleAddMapping = async () => {
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
    if (!formData.subjectId) {
      toast.error("Please select a subject");
      return;
    }

    setIsSubmitting(true);
    try {
      const newAssignment = await teacherAssignmentService.create(formData);
      setAssignments(prev => [...prev, newAssignment]);
      toast.success("Teacher mapping added successfully!");
      setFormData({ teacherId: "", classId: "", sectionId: "", subjectId: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add mapping";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMapping = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this mapping?")) {
      try {
        await teacherAssignmentService.delete(id);
        setAssignments(prev => prev.filter(a => a.id !== id));
        toast.success("Mapping removed successfully!");
      } catch {
        toast.error("Failed to remove mapping");
      }
    }
  };

  const getTeacherName = (assignment: TeacherAssignment) => {
    if (assignment.teacherName) return assignment.teacherName;
    const teacher = teachers.find(t => t.id === assignment.teacherId);
    return teacher?.name ?? assignment.teacherId;
  };

  const getClassName = (assignment: TeacherAssignment) => {
    if (assignment.className) return assignment.className;
    const cls = classes.find(c => c.id === assignment.classId);
    return cls?.name ?? assignment.classId;
  };

  const getSectionName = (assignment: TeacherAssignment) => {
    if (assignment.sectionName) return assignment.sectionName;
    return assignment.sectionId;
  };

  const getSubjectName = (assignment: TeacherAssignment) => {
    if (assignment.subjectName) return assignment.subjectName;
    const subject = subjects.find(s => s.id === assignment.subjectId);
    return subject?.name ?? assignment.subjectId;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher-Subject Mapping</h1>
        <p className="text-muted-foreground">Assign teachers to class-section-subject combinations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Select Teacher</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData({ ...formData, classId: value, sectionId: "" })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose class" />
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

            <div className="space-y-2">
              <Label>Select Section</Label>
              <Select
                value={formData.sectionId}
                onValueChange={(value) => setFormData({ ...formData, sectionId: value })}
                disabled={isSubmitting || !formData.classId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.classId ? "Choose section" : "Select class first"} />
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

            <div className="space-y-2">
              <Label>Select Subject</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddMapping} className="mt-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Mapping
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Mappings ({assignments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No mappings found. Add one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{getTeacherName(assignment)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getClassName(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getSectionName(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getSubjectName(assignment)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
