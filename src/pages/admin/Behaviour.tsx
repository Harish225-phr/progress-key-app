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
import { ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";

const mockBehaviour = [
  { id: 1, student: "Emily Davis", class: "9-B", type: "Excellent", remark: "Outstanding participation in class", teacher: "Dr. Robert Smith", date: "2024-01-15" },
  { id: 2, student: "John Smith", class: "10-A", type: "Good", remark: "Helped classmates with assignments", teacher: "Ms. Jennifer Wilson", date: "2024-01-14" },
  { id: 3, student: "Michael Brown", class: "9-A", type: "Needs Improvement", remark: "Late submission of homework", teacher: "Mr. David Brown", date: "2024-01-13" },
  { id: 4, student: "Sarah Johnson", class: "10-B", type: "Good", remark: "Active in group discussions", teacher: "Dr. Robert Smith", date: "2024-01-12" },
];

const getBehaviourIcon = (type: string) => {
  switch (type) {
    case "Excellent":
    case "Good":
      return <ThumbsUp className="h-4 w-4 text-green-600" />;
    case "Needs Improvement":
      return <ThumbsDown className="h-4 w-4 text-orange-600" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
};

export default function Behaviour() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Behaviour Reports</h1>
        <p className="text-muted-foreground">Track student behaviour and teacher remarks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Excellent Behaviour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              48
              <ThumbsUp className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Good Behaviour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
              15
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires follow-up</p>
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
              <Label>Behaviour Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="needs">Needs Improvement</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behaviour Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBehaviour.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.student}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getBehaviourIcon(record.type)}
                      <Badge
                        variant={
                          record.type === "Excellent" || record.type === "Good"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {record.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">{record.remark}</TableCell>
                  <TableCell>{record.teacher}</TableCell>
                  <TableCell>{record.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
