import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { ClipboardList, CalendarIcon, PenLine, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const mockTests = [
  { id: 1, name: "Unit Test - Algebra", class: "10th", section: "A", chapter: "Chapter 1-3", maxMarks: 50, date: "2024-03-25", type: "Unit", status: "Upcoming" },
  { id: 2, name: "Weekly Quiz - Geometry", class: "10th", section: "B", chapter: "Chapter 4", maxMarks: 20, date: "2024-03-20", type: "Weekly", status: "Marks Pending" },
  { id: 3, name: "Midterm Exam", class: "9th", section: "A", chapter: "All Chapters", maxMarks: 100, date: "2024-03-15", type: "Midterm", status: "Completed" },
  { id: 4, name: "Weekly Quiz - Trigonometry", class: "10th", section: "A", chapter: "Chapter 5", maxMarks: 25, date: "2024-03-10", type: "Weekly", status: "Completed" },
];

const classes = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "All Chapters"];
const testTypes = ["Weekly", "Unit", "Midterm", "Final"];

export default function TestsPage() {
  const [tests, setTests] = useState(mockTests);
  const [testDate, setTestDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    chapter: "",
    maxMarks: "",
    type: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.class || !formData.section || !formData.maxMarks || !testDate || !formData.type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTest = {
      id: tests.length + 1,
      name: formData.name,
      class: formData.class,
      section: formData.section,
      chapter: formData.chapter || "Not specified",
      maxMarks: parseInt(formData.maxMarks),
      date: format(testDate, "yyyy-MM-dd"),
      type: formData.type,
      status: "Upcoming",
    };

    setTests([newTest, ...tests]);
    toast.success("Test created successfully!");
    setFormData({
      name: "",
      class: "",
      section: "",
      chapter: "",
      maxMarks: "",
      type: "",
    });
    setTestDate(undefined);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return <Badge variant="outline" className="border-blue-500 text-blue-500"><Clock className="h-3 w-3 mr-1" />Upcoming</Badge>;
      case "Marks Pending":
        return <Badge variant="default" className="bg-amber-500"><PenLine className="h-3 w-3 mr-1" />Marks Pending</Badge>;
      case "Completed":
        return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Weekly: "bg-green-100 text-green-700",
      Unit: "bg-blue-100 text-blue-700",
      Midterm: "bg-purple-100 text-purple-700",
      Final: "bg-red-100 text-red-700",
    };
    return <Badge className={colors[type] || ""}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Test / Exam</h1>
        <p className="text-muted-foreground">Create tests and manage assessments for your subject</p>
      </div>

      {/* Create Test Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            New Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Test Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Unit Test - Algebra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Test Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !testDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {testDate ? format(testDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={testDate}
                      onSelect={setTestDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMarks">Maximum Marks *</Label>
                <Input
                  id="maxMarks"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Select Class *</Label>
                <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Section *</Label>
                <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Test Type *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label>Chapter / Topic</Label>
                <Select value={formData.chapter} onValueChange={(v) => setFormData({ ...formData, chapter: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Test
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tests List */}
      <Card>
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Class / Section</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium">{test.name}</TableCell>
                  <TableCell>{test.class} - {test.section}</TableCell>
                  <TableCell>{test.chapter}</TableCell>
                  <TableCell>{test.maxMarks}</TableCell>
                  <TableCell>{test.date}</TableCell>
                  <TableCell>{getTypeBadge(test.type)}</TableCell>
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/subject-teacher/marks?testId=${test.id}`}>
                        <PenLine className="h-4 w-4 mr-1" />
                        Enter Marks
                      </Link>
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
