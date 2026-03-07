import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { subjectService, type Subject, type SubjectData } from "@/services/subjectService";
import { getClasses } from "@/services/classService";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState<Omit<SubjectData, 'credits'> & { credits?: string }>({
    name: "",
    code: "",
    type: "",
    description: "",
    credits: "",
    classId: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch {
      toast.error("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data.map((c) => ({ id: c.id, name: c.name })));
    } catch {
      toast.error("Failed to fetch classes");
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const newSubject = await subjectService.create({
        name: formData.name.trim(),
        code: formData.code?.trim() || undefined,
        type: formData.type?.trim() || undefined,
        description: formData.description?.trim() || undefined,
        credits: formData.credits ? parseInt(formData.credits) : undefined,
        classId: formData.classId,
      });
      setSubjects((prev) => [...prev, newSubject]);
      toast.success("Subject added successfully!");
      setDialogOpen(false);
      setFormData({ 
        name: "", 
        code: "",
        type: "",
        description: "",
        credits: "",
        classId: "" 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add subject";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await subjectService.delete(subjectId);
        setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
        toast.success("Subject deleted successfully!");
      } catch {
        toast.error("Failed to delete subject");
      }
    }
  };

  const getClassName = (subject: Subject) => {
    if (subject.className) return subject.className;
    const cls = classes.find((c) => c.id === subject.classId);
    return cls?.name ?? subject.classId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subject Management</h1>
          <p className="text-muted-foreground">Manage subjects and their details</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Subject Name *</Label>
                <Input
                  id="subjectName"
                  placeholder="e.g., Mathematics"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  maxLength={50}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input
                  id="subjectCode"
                  placeholder="e.g., MATH101"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  disabled={isSubmitting}
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="subjectType">Type</Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="subjectType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Elective">Elective</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subjectCredits">Credits</Label>
                <Input
                  id="subjectCredits"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.credits || ""}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  disabled={isSubmitting}
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <Label htmlFor="subjectDescription">Description</Label>
                <textarea
                  id="subjectDescription"
                  className="w-full p-2 border rounded-md resize-none h-20"
                  placeholder="Enter subject description..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={isSubmitting}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description?.length || 0}/200 characters
                </p>
              </div>
              <div>
                <Label htmlFor="classId">Class</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select class (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific class</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !formData.name.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Subject"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject List ({subjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No subjects found. Add one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.code || "-"}</TableCell>
                    <TableCell>
                      {subject.type && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject.type === 'Core' ? 'bg-blue-100 text-blue-800' :
                          subject.type === 'Elective' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {subject.type}
                        </span>
                      ) || "-"}
                    </TableCell>
                    <TableCell>{subject.credits || "-"}</TableCell>
                    <TableCell>{getClassName(subject)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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
