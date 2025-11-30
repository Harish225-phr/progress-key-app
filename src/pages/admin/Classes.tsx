import { useState } from "react";
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
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

const mockClasses = [
  { id: 1, name: "Class 9", description: "Grade 9", sections: 2, students: 60, status: true },
  { id: 2, name: "Class 10", description: "Grade 10", sections: 2, students: 55, status: true },
  { id: 3, name: "Class 11", description: "Grade 11", sections: 2, students: 50, status: true },
];

const mockSections = [
  { id: 1, className: "Class 9", name: "Section A", students: 30, status: true },
  { id: 2, className: "Class 9", name: "Section B", students: 30, status: true },
  { id: 3, className: "Class 10", name: "Section A", students: 28, status: true },
  { id: 4, className: "Class 10", name: "Section B", students: 27, status: true },
];

export default function Classes() {
  const [classes, setClasses] = useState(mockClasses);
  const [sections, setSections] = useState(mockSections);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);

  const handleAddClass = () => {
    toast.success("Class added successfully!");
    setClassDialogOpen(false);
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

      <div className="grid gap-6">
        {/* Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Classes</CardTitle>
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="className">Class Name</Label>
                    <Input id="className" placeholder="e.g., Class 12" />
                  </div>
                  <div>
                    <Label htmlFor="classDesc">Description</Label>
                    <Input id="classDesc" placeholder="e.g., Grade 12" />
                  </div>
                  <Button onClick={handleAddClass} className="w-full">
                    Add Class
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium">{cls.name}</TableCell>
                    <TableCell>{cls.description}</TableCell>
                    <TableCell>{cls.sections}</TableCell>
                    <TableCell>{cls.students}</TableCell>
                    <TableCell>
                      <Badge variant={cls.status ? "default" : "secondary"}>
                        {cls.status ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch checked={cls.status} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
