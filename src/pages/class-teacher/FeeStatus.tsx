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
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DollarSign, Calendar, Plus } from "lucide-react";

const mockFeeData = [
  { id: 1, studentName: "John Smith", roll: "101", status: "Paid", lastUpdated: "2024-03-15" },
  { id: 2, studentName: "Sarah Johnson", roll: "102", status: "Pending", lastUpdated: "2024-02-28" },
  { id: 3, studentName: "Michael Brown", roll: "103", status: "Paid", lastUpdated: "2024-03-10" },
  { id: 4, studentName: "Emily Davis", roll: "104", status: "Paid", lastUpdated: "2024-03-12" },
  { id: 5, studentName: "David Wilson", roll: "105", status: "Pending", lastUpdated: "2024-02-25" },
];

export default function FeeStatus() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [feeData, setFeeData] = useState(mockFeeData);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentName: "",
    roll: "",
    status: "Pending",
  });

  const handleUpdateFee = () => {
    if (selectedStudent) {
      setFeeData((prev) =>
        prev.map((student) =>
          student.id === selectedStudent.id
            ? {
                ...student,
                status: isPaid ? "Paid" : "Pending",
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : student
        )
      );
      toast.success(`Fee status updated for ${selectedStudent.studentName}`);
      setSelectedStudent(null);
    }
  };

  const handleAddStudent = () => {
    if (!newStudent.studentName || !newStudent.roll) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const student = {
      id: feeData.length + 1,
      studentName: newStudent.studentName,
      roll: newStudent.roll,
      status: newStudent.status,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    
    setFeeData((prev) => [...prev, student]);
    toast.success(`${newStudent.studentName} added successfully`);
    setShowAddDialog(false);
    setNewStudent({ studentName: "", roll: "", status: "Pending" });
  };

  const openUpdateModal = (student: any) => {
    setSelectedStudent(student);
    setIsPaid(student.status === "Paid");
  };

  const filteredData = feeData.filter(
    (student) => statusFilter === "all" || student.status === statusFilter
  );

  const paidCount = feeData.filter((s) => s.status === "Paid").length;
  const pendingCount = feeData.filter((s) => s.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Status</h1>
          <p className="text-muted-foreground">Manage and track student fee payments</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{paidCount}</div>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Students</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Fee Status ({filteredData.length})</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentName}</TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "Paid" ? "default" : "destructive"}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {student.lastUpdated}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => openUpdateModal(student)}>
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Fee Status</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Student Name</p>
                <p className="font-semibold text-lg">{selectedStudent.studentName}</p>
                <p className="text-sm text-muted-foreground">Roll No: {selectedStudent.roll}</p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="fee-status" className="text-base">
                  Mark as Paid
                </Label>
                <Switch id="fee-status" checked={isPaid} onCheckedChange={setIsPaid} />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleUpdateFee} className="flex-1">
                  Update Status
                </Button>
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Student to Fee Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter student name"
                value={newStudent.studentName}
                onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roll">Roll Number</Label>
              <Input
                id="roll"
                placeholder="Enter roll number"
                value={newStudent.roll}
                onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeStatus">Initial Fee Status</Label>
              <Select value={newStudent.status} onValueChange={(value) => setNewStudent({ ...newStudent, status: value })}>
                <SelectTrigger id="feeStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleAddStudent} className="flex-1">
                Add Student
              </Button>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setNewStudent({ studentName: "", roll: "", status: "Pending" });
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
