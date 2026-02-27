import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClasses } from "@/hooks/useClasses";
import { Alert, AlertDescription } from "@/components/ui/alert";

const mockSections = [
  { id: 1, className: "Class 9", name: "Section A", students: 30, status: true },
  { id: 2, className: "Class 9", name: "Section B", students: 30, status: true },
  { id: 3, className: "Class 10", name: "Section A", students: 28, status: true },
  { id: 4, className: "Class 10", name: "Section B", students: 27, status: true },
];

export default function Classes() {
  const { classes, loading, error, addClass, deleteClass, fetchClasses, clearError } = useClasses();
  const [sections, setSections] = useState(mockSections);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

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

  const handleAddSection = () => {
    toast.success("Section added successfully!");
    setSectionDialogOpen(false);
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sectionClass">Select Class</Label>
                    <Input id="sectionClass" placeholder="Class 9" />
                  </div>
                  <div>
                    <Label htmlFor="sectionName">Section Name</Label>
                    <Input id="sectionName" placeholder="e.g., Section C" />
                  </div>
                  <Button onClick={handleAddSection} className="w-full">
                    Add Section
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Section Name</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.className}</TableCell>
                    <TableCell>{section.name}</TableCell>
                    <TableCell>{section.students}</TableCell>
                    <TableCell>
                      <Badge variant={section.status ? "default" : "secondary"}>
                        {section.status ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch checked={section.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
