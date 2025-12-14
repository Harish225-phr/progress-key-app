import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Award,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// Dummy data
const testsList = [
  {
    id: 1,
    name: "Mathematics Weekly Test 5",
    subject: "Mathematics",
    date: "Dec 12, 2024",
    marksObtained: 42,
    maxMarks: 50,
    percentage: 84,
    status: "pass",
  },
  {
    id: 2,
    name: "Science Unit Test - Forces",
    subject: "Science",
    date: "Dec 10, 2024",
    marksObtained: 38,
    maxMarks: 50,
    percentage: 76,
    status: "pass",
  },
  {
    id: 3,
    name: "English Grammar Quiz",
    subject: "English",
    date: "Dec 8, 2024",
    marksObtained: 18,
    maxMarks: 20,
    percentage: 90,
    status: "pass",
  },
  {
    id: 4,
    name: "History Midterm Exam",
    subject: "History",
    date: "Dec 5, 2024",
    marksObtained: 65,
    maxMarks: 100,
    percentage: 65,
    status: "pass",
  },
  {
    id: 5,
    name: "Mathematics Weekly Test 4",
    subject: "Mathematics",
    date: "Dec 1, 2024",
    marksObtained: 35,
    maxMarks: 50,
    percentage: 70,
    status: "pass",
  },
  {
    id: 6,
    name: "Science Quiz - Chemistry",
    subject: "Science",
    date: "Nov 28, 2024",
    marksObtained: 8,
    maxMarks: 20,
    percentage: 40,
    status: "fail",
  },
];

const performanceTrend = [
  { month: "Sep", percentage: 78 },
  { month: "Oct", percentage: 72 },
  { month: "Nov", percentage: 80 },
  { month: "Dec", percentage: 83 },
];

const subjectPerformance = [
  { subject: "Math", percentage: 77 },
  { subject: "Science", percentage: 68 },
  { subject: "English", percentage: 85 },
  { subject: "History", percentage: 65 },
];

const TestsPage = () => {
  const [selectedTest, setSelectedTest] = useState<typeof testsList[0] | null>(null);

  const averagePercentage = Math.round(
    testsList.reduce((sum, test) => sum + test.percentage, 0) / testsList.length
  );
  const passCount = testsList.filter((t) => t.status === "pass").length;
  const failCount = testsList.filter((t) => t.status === "fail").length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tests & Marks</h1>
        <p className="text-muted-foreground">View your test results and performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{testsList.length}</p>
            <p className="text-xs text-muted-foreground">Total Tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{averagePercentage}%</p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{passCount}</p>
            <p className="text-xs text-muted-foreground">Passed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-600">{failCount}</p>
            <p className="text-xs text-muted-foreground">Needs Improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Subject-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance}>
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="percentage"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Marks</TableHead>
                  <TableHead className="text-center">Percentage</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Graph</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testsList.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-xs text-muted-foreground">{test.subject}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {test.date}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">
                        {test.marksObtained}/{test.maxMarks}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Progress value={test.percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium">{test.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={test.status === "pass" ? "secondary" : "destructive"}
                      >
                        {test.status === "pass" ? "Pass" : "Fail"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTest(test)}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{test.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-foreground">
                                  {test.marksObtained}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Marks Obtained
                                </p>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-2xl font-bold text-foreground">
                                  {test.maxMarks}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Maximum Marks
                                </p>
                              </div>
                            </div>
                            <div className="h-[200px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={[
                                    {
                                      name: "Obtained",
                                      value: test.marksObtained,
                                    },
                                    { name: "Maximum", value: test.maxMarks },
                                  ]}
                                >
                                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                  <YAxis axisLine={false} tickLine={false} />
                                  <Tooltip />
                                  <Bar
                                    dataKey="value"
                                    fill="hsl(var(--primary))"
                                    radius={[8, 8, 0, 0]}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="text-center">
                              <Badge
                                variant={
                                  test.percentage >= 80
                                    ? "secondary"
                                    : test.percentage >= 50
                                    ? "outline"
                                    : "destructive"
                                }
                                className="text-lg px-4 py-1"
                              >
                                {test.percentage}% -{" "}
                                {test.percentage >= 80
                                  ? "Excellent"
                                  : test.percentage >= 60
                                  ? "Good"
                                  : test.percentage >= 50
                                  ? "Average"
                                  : "Needs Improvement"}
                              </Badge>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsPage;
