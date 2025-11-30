import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

const mockMarks = [
  { id: 1, student: "John Smith", class: "10-A", subject: "Mathematics", marks: 95, maxMarks: 100, rank: 1 },
  { id: 2, student: "Emily Davis", class: "9-B", subject: "Mathematics", marks: 92, maxMarks: 100, rank: 2 },
  { id: 3, student: "Sarah Johnson", class: "10-B", subject: "Physics", marks: 88, maxMarks: 100, rank: 3 },
  { id: 4, student: "Michael Brown", class: "9-A", subject: "Chemistry", marks: 78, maxMarks: 100, rank: 4 },
];

export default function Marks() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test & Marks Reports</h1>
        <p className="text-muted-foreground">View test results and student performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85.3%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              95
              <TrendingUp className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">John Smith - Mathematics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              78
              <TrendingDown className="h-4 w-4" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Michael Brown - Chemistry</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">Above 40% marks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All tests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="midterm">Mid Term</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                  <SelectItem value="unit">Unit Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMarks.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      <span className="font-medium">#{record.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{record.student}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>{record.subject}</TableCell>
                  <TableCell>
                    <span className="font-medium">{record.marks}</span>
                    <span className="text-muted-foreground">/{record.maxMarks}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.marks >= 90 ? "default" : record.marks >= 75 ? "secondary" : "outline"}>
                      {((record.marks / record.maxMarks) * 100).toFixed(0)}%
                    </Badge>
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
