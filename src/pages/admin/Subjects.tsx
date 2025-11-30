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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";

const mockSubjects = [
  { id: 1, name: "Mathematics", code: "MATH-101", type: "Theory", status: true },
  { id: 2, name: "Physics", code: "PHY-101", type: "Theory", status: true },
  { id: 3, name: "Chemistry", code: "CHEM-101", type: "Theory", status: true },
  { id: 4, name: "Physics Lab", code: "PHY-LAB", type: "Practical", status: true },
  { id: 5, name: "Chemistry Lab", code: "CHEM-LAB", type: "Practical", status: true },
  { id: 6, name: "English", code: "ENG-101", type: "Theory", status: true },
];

export default function Subjects() {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddSubject = () => {
    toast.success("Subject added successfully!");
    setDialogOpen(false);
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
            <div className="space-y-4">
              <div>
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input id="subjectName" placeholder="e.g., Mathematics" />
              </div>
              <div>
                <Label htmlFor="subjectCode">Subject Code</Label>
                <Input id="subjectCode" placeholder="e.g., MATH-101" />
              </div>
              <div>
                <Label htmlFor="subjectType">Subject Type</Label>
                <Select>
                  <SelectTrigger id="subjectType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddSubject} className="w-full">
                Add Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject List ({subjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Subject Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>
                    <Badge variant={subject.type === "Theory" ? "default" : "secondary"}>
                      {subject.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subject.status ? "default" : "outline"}>
                      {subject.status ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Switch checked={subject.status} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
