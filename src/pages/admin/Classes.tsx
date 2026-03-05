import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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

import { Plus, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClasses } from "@/hooks/useClasses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addSection, getSections, deleteSection, type SectionResponse } from "@/services/classService";
import { userService, type User } from "@/services/userService";

export default function Classes() {
  const { classes, loading, error, addClass, deleteClass, fetchClasses, clearError } = useClasses();
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [selectedSectionClassId, setSelectedSectionClassId] = useState("");
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [sectionClassTeacher, setSectionClassTeacher] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSectionSubmitting, setIsSectionSubmitting] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Fetch sections
  useEffect(() => {
    const fetchSections = async () => {
      setSectionsLoading(true);
      try {
        const sectionsData = await getSections();
        setSections(sectionsData);
      } catch {
        toast.error("Failed to fetch sections");
      } finally {
        setSectionsLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      setTeachersLoading(true);
      try {
        const users = await userService.getAll();
        const teacherUsers = users.filter((user) => {
          const normalizedRole = String(user.role ?? "").toUpperCase();
          return normalizedRole.includes("TEACHER");
        });
        setTeachers(teacherUsers);
      } catch {
        toast.error("Failed to fetch teachers");
      } finally {
        setTeachersLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Validate class name
  const validateClassName = (name: string): boolean => {
    if (!name.trim()) {
      toast.error("Class name is required");
      return false;
    }
    if (name.trim().length < 2) {
      toast.error("Class name must be at least 2 characters");
      return false;
    }
    if (name.trim().length > 50) {
      toast.error("Class name must be less than 50 characters");
      return false;
    }
    return true;
  };

  // Handle add class
  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateClassName(className)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addClass({ name: className.trim() });

      if (result) {
        toast.success("Class added successfully!");
        setClassName("");
        setClassDialogOpen(false);
      }
    } catch (err) {
      console.error("Error adding class:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete class
  const handleDeleteClass = async (classId: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      const result = await deleteClass(classId);
      if (result) {
        toast.success("Class deleted successfully!");
      } else {
        toast.error("Failed to delete class");
      }
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSectionClassId) {
      toast.error("Please select a class");
      return;
    }

    if (!sectionName.trim()) {
      toast.error("Section name is required");
      return;
    }

    if (!sectionClassTeacher) {
      toast.error("Class teacher is required");
      return;
    }

    setIsSectionSubmitting(true);

    try {
      const createdSection = await addSection({
        name: sectionName.trim(),
        classId: selectedSectionClassId,
        classTeacher: sectionClassTeacher,
      });

      setSections((prevSections) => [...prevSections, createdSection]);

      toast.success("Section added successfully!");
      setSectionName("");
      setSectionClassTeacher("");
      setSelectedSectionClassId("");
      setSectionDialogOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add section";
      toast.error(errorMessage);
    } finally {
      setIsSectionSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deleteSection(sectionId);
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
        toast.success("Section deleted successfully!");
      } catch {
        toast.error("Failed to delete section");
      }
    }
  };

  const getClassName = (section: SectionResponse) => {
    if (section.className) return section.className;
    const cls = classes.find((c) => String(c.id) === section.classId);
    return cls?.name ?? section.classId;
  };

  const getTeacherName = (section: SectionResponse) => {
    if (section.classTeacherName) return section.classTeacherName;
    const teacher = teachers.find((t) => String(t.id) === section.classTeacher);
    return teacher?.name ?? section.classTeacher;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Class & Section Management</h1>
        <p className="text-muted-foreground">Manage classes and sections</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-sm underline hover:no-underline ml-4"
            >
              Dismiss
            </button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Classes ({classes.length})</CardTitle>
            <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddClass} className="space-y-4">
                  <div>
                    <Label htmlFor="className">Class Name *</Label>
                    <Input
                      id="className"
                      placeholder="e.g., Class 10"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      disabled={isSubmitting}
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {className.length}/50 characters
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !className.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Class"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading && classes.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : classes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No classes found. Add one to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cls.createdAt
                          ? new Date(cls.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClass(cls.id)}
                            title="Delete class"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sections</CardTitle>
            <Dialog open={sectionDialogOpen} onOpenChange={setSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSection} className="space-y-4">
                  <div>
                    <Label htmlFor="sectionClass">Select Class *</Label>
                    <Select
                      value={selectedSectionClassId}
                      onValueChange={setSelectedSectionClassId}
                      disabled={isSectionSubmitting || classes.length === 0}
                    >
                      <SelectTrigger id="sectionClass">
                        <SelectValue
                          placeholder={classes.length === 0 ? "No classes available" : "Select class"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={String(cls.id)} value={String(cls.id)}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sectionName">Section Name *</Label>
                    <Input
                      id="sectionName"
                      placeholder="e.g., Section C"
                      value={sectionName}
                      onChange={(e) => setSectionName(e.target.value)}
                      disabled={isSectionSubmitting}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="classTeacher">Class Teacher *</Label>
                    <Select
                      value={sectionClassTeacher}
                      onValueChange={setSectionClassTeacher}
                      disabled={isSectionSubmitting || teachersLoading || teachers.length === 0}
                    >
                      <SelectTrigger id="classTeacher">
                        <SelectValue
                          placeholder={
                            teachersLoading
                              ? "Loading teachers..."
                              : teachers.length === 0
                                ? "No teachers available"
                                : "Select class teacher"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={String(teacher.id)} value={String(teacher.id)}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isSectionSubmitting ||
                      classes.length === 0 ||
                      teachers.length === 0 ||
                      !selectedSectionClassId ||
                      !sectionName.trim() ||
                      !sectionClassTeacher
                    }
                  >
                    {isSectionSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Section"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {sectionsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sections found. Add one to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Section Name</TableHead>
                    <TableHead>Class Teacher</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sections.map((section) => (
                    <TableRow key={section.id}>
                      <TableCell className="font-medium">{getClassName(section)}</TableCell>
                      <TableCell>{section.name}</TableCell>
                      <TableCell>{getTeacherName(section)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSection(section.id)}
                            title="Delete section"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
