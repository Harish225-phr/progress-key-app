import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { BarChart3, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";

const mockStudents = [
  { id: 1, name: "John Smith", roll: "101", tests: [45, 42, 48, 50, 47], overall: 92.8, status: "Strong" },
  { id: 2, name: "Emma Johnson", roll: "102", tests: [40, 38, 42, 44, 40], overall: 81.6, status: "Strong" },
  { id: 3, name: "Michael Brown", roll: "103", tests: [35, 32, 38, 36, 34], overall: 70.0, status: "Medium" },
  { id: 4, name: "Sarah Davis", roll: "104", tests: [28, 30, 32, 29, 31], overall: 60.0, status: "Medium" },
  { id: 5, name: "James Wilson", roll: "105", tests: [20, 22, 25, 23, 24], overall: 45.6, status: "Weak" },
  { id: 6, name: "Emily Taylor", roll: "106", tests: [48, 46, 49, 50, 48], overall: 96.4, status: "Strong" },
  { id: 7, name: "Daniel Anderson", roll: "107", tests: [38, 40, 35, 42, 39], overall: 77.6, status: "Medium" },
  { id: 8, name: "Olivia Martinez", roll: "108", tests: [30, 28, 32, 30, 29], overall: 59.6, status: "Medium" },
  { id: 9, name: "William Garcia", roll: "109", tests: [18, 20, 22, 19, 21], overall: 40.0, status: "Weak" },
  { id: 10, name: "Sophia Rodriguez", roll: "110", tests: [44, 46, 43, 48, 45], overall: 90.4, status: "Strong" },
];

const classes = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];

export default function PerformancePage() {
  const [selectedClass, setSelectedClass] = useState("10th");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Strong":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200" variant="outline">
            <TrendingUp className="h-3 w-3 mr-1" />
            Strong
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200" variant="outline">
            <Minus className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        );
      case "Weak":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200" variant="outline">
            <TrendingDown className="h-3 w-3 mr-1" />
            Weak
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getChartData = (student: typeof mockStudents[0]) => {
    return student.tests.map((marks, index) => ({
      name: `Test ${index + 1}`,
      marks,
      maxMarks: 50,
    }));
  };

  const getLineChartData = (student: typeof mockStudents[0]) => {
    return student.tests.map((marks, index) => ({
      name: `T${index + 1}`,
      marks,
      percentage: (marks / 50) * 100,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Student Performance</h1>
        <p className="text-muted-foreground">Subject-wise performance analysis of students</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Section</label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">4</div>
            <p className="text-sm text-muted-foreground">Strong Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">4</div>
            <p className="text-sm text-muted-foreground">Medium Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-sm text-muted-foreground">Weak Students</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">71.4%</div>
            <p className="text-sm text-muted-foreground">Class Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Table - {selectedClass} {selectedSection}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center" colSpan={5}>Last 5 Test Marks (out of 50)</TableHead>
                <TableHead>Overall %</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Graph</TableHead>
              </TableRow>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="text-center text-xs">T1</TableHead>
                <TableHead className="text-center text-xs">T2</TableHead>
                <TableHead className="text-center text-xs">T3</TableHead>
                <TableHead className="text-center text-xs">T4</TableHead>
                <TableHead className="text-center text-xs">T5</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono">{student.roll}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  {student.tests.map((marks, idx) => (
                    <TableCell key={idx} className="text-center">
                      <span className={marks >= 40 ? "text-green-600" : marks >= 25 ? "text-yellow-600" : "text-red-600"}>
                        {marks}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell>
                    <span className={`font-semibold ${student.overall >= 75 ? "text-green-600" : student.overall >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                      {student.overall.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Graph Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Performance Graph - {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-semibold">{selectedStudent.roll}</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Overall %</p>
                  <p className="font-semibold text-lg">{selectedStudent.overall.toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedStudent.status)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Bar Chart - Test Marks</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData(selectedStudent)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 50]} />
                      <Tooltip />
                      <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Line Chart - Progress Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getLineChartData(selectedStudent)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
