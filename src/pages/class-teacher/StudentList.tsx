import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockStudents = [
  { id: 1, name: "John Smith", roll: "101", class: "10", section: "A", attendance: "95%", feeStatus: "Paid", behaviour: "Good" },
  { id: 2, name: "Sarah Johnson", roll: "102", class: "10", section: "A", attendance: "92%", feeStatus: "Pending", behaviour: "Excellent" },
  { id: 3, name: "Michael Brown", roll: "103", class: "10", section: "A", attendance: "88%", feeStatus: "Paid", behaviour: "Good" },
  { id: 4, name: "Emily Davis", roll: "104", class: "10", section: "A", attendance: "97%", feeStatus: "Paid", behaviour: "Excellent" },
  { id: 5, name: "David Wilson", roll: "105", class: "10", section: "A", attendance: "90%", feeStatus: "Pending", behaviour: "Needs Improvement" },
];

export default function StudentList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || student.feeStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBehaviourVariant = (behaviour: string) => {
    switch (behaviour) {
      case "Excellent":
        return "default";
      case "Good":
        return "secondary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">View and manage your class students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Fee Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead>Behaviour</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.roll}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.attendance}</TableCell>
                  <TableCell>
                    <Badge variant={student.feeStatus === "Paid" ? "default" : "destructive"}>
                      {student.feeStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getBehaviourVariant(student.behaviour)}>
                      {student.behaviour}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/class-teacher/students/${student.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
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
