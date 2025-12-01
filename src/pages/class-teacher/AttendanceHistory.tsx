import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Calendar } from "lucide-react";

const mockHistory = [
  { date: "2024-03-20", totalStudents: 42, present: 40, absent: 2, percentage: "95%" },
  { date: "2024-03-19", totalStudents: 42, present: 38, absent: 4, percentage: "90%" },
  { date: "2024-03-18", totalStudents: 42, present: 41, absent: 1, percentage: "98%" },
  { date: "2024-03-15", totalStudents: 42, present: 39, absent: 3, percentage: "93%" },
  { date: "2024-03-14", totalStudents: 42, present: 42, absent: 0, percentage: "100%" },
];

const mockStudentWise = [
  { name: "John Smith", roll: "101", present: 18, absent: 2, percentage: "90%" },
  { name: "Sarah Johnson", roll: "102", present: 19, absent: 1, percentage: "95%" },
  { name: "Michael Brown", roll: "103", present: 17, absent: 3, percentage: "85%" },
  { name: "Emily Davis", roll: "104", present: 20, absent: 0, percentage: "100%" },
  { name: "David Wilson", roll: "105", present: 16, absent: 4, percentage: "80%" },
];

export default function AttendanceHistory() {
  const [viewMode, setViewMode] = useState("daily");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance History</h1>
          <p className="text-muted-foreground">View historical attendance records</p>
        </div>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily View</SelectItem>
            <SelectItem value="student">Student-wise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Best Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">March 14</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">198</div>
            <p className="text-xs text-muted-foreground">Last 5 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Last 5 days</p>
          </CardContent>
        </Card>
      </div>

      {viewMode === "daily" ? (
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Students</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((record) => (
                  <TableRow key={record.date}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {record.date}
                      </div>
                    </TableCell>
                    <TableCell>{record.totalStudents}</TableCell>
                    <TableCell>
                      <Badge variant="default">{record.present}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{record.absent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={parseInt(record.percentage) >= 90 ? "default" : "secondary"}
                      >
                        {record.percentage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudentWise.map((student) => (
                  <TableRow key={student.roll}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.roll}</TableCell>
                    <TableCell>
                      <Badge variant="default">{student.present}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{student.absent}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={parseInt(student.percentage) >= 90 ? "default" : "secondary"}
                      >
                        {student.percentage}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
