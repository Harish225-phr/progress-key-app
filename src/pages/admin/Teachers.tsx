import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Eye, Edit } from "lucide-react";

const mockTeachers = [
  { id: 1, name: "Dr. Robert Smith", email: "robert@school.com", subjects: ["Mathematics", "Physics"], classes: ["10-A", "11-B"], isClassTeacher: true, status: "Active" },
  { id: 2, name: "Ms. Jennifer Wilson", email: "jennifer@school.com", subjects: ["Chemistry"], classes: ["9-A", "10-B"], isClassTeacher: true, status: "Active" },
  { id: 3, name: "Mr. David Brown", email: "david@school.com", subjects: ["English", "Hindi"], classes: ["9-A", "9-B", "10-A"], isClassTeacher: false, status: "Active" },
  { id: 4, name: "Ms. Sarah Davis", email: "sarah@school.com", subjects: ["Biology"], classes: ["11-A"], isClassTeacher: false, status: "Active" },
];

export default function Teachers() {
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher Management</h1>
        <p className="text-muted-foreground">View and manage teacher records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher List ({mockTeachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((cls, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {teacher.isClassTeacher && (
                      <Badge variant="default">Class Teacher</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{teacher.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Teacher Profile</DialogTitle>
          </DialogHeader>
          {selectedTeacher && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedTeacher.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedTeacher.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-medium">EMP-{selectedTeacher.id.toString().padStart(3, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="default">{selectedTeacher.status}</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Assigned Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.subjects.map((subject: string, i: number) => (
                    <Badge key={i} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Teaching Assignments</p>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  {selectedTeacher.classes.map((cls: string, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{cls}</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedTeacher.subjects[i % selectedTeacher.subjects.length]}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
