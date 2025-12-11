import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";
import { PenLine, Save, CheckCircle, BookOpen, Users } from "lucide-react";

const mockTests = [
  { id: 1, name: "Unit Test - Algebra", class: "10th", section: "A", maxMarks: 50 },
  { id: 2, name: "Weekly Quiz - Geometry", class: "10th", section: "B", maxMarks: 20 },
  { id: 3, name: "Midterm Exam", class: "9th", section: "A", maxMarks: 100 },
];

const mockStudents = [
  { id: 1, roll: "101", name: "John Smith", marks: "", remarks: "" },
  { id: 2, roll: "102", name: "Emma Johnson", marks: "", remarks: "" },
  { id: 3, roll: "103", name: "Michael Brown", marks: "", remarks: "" },
  { id: 4, roll: "104", name: "Sarah Davis", marks: "", remarks: "" },
  { id: 5, roll: "105", name: "James Wilson", marks: "", remarks: "" },
  { id: 6, roll: "106", name: "Emily Taylor", marks: "", remarks: "" },
  { id: 7, roll: "107", name: "Daniel Anderson", marks: "", remarks: "" },
  { id: 8, roll: "108", name: "Olivia Martinez", marks: "", remarks: "" },
  { id: 9, roll: "109", name: "William Garcia", marks: "", remarks: "" },
  { id: 10, roll: "110", name: "Sophia Rodriguez", marks: "", remarks: "" },
];

const remarkOptions = ["Excellent", "Good", "Needs Improvement", "Not attentive"];

export default function MarksPage() {
  const [selectedTest, setSelectedTest] = useState<typeof mockTests[0] | null>(null);
  const [students, setStudents] = useState(mockStudents);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectTest = (testId: string) => {
    const test = mockTests.find((t) => t.id === parseInt(testId));
    setSelectedTest(test || null);
    setShowSuccess(false);
  };

  const handleMarksChange = (studentId: number, marks: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, marks } : s
      )
    );
  };

  const handleRemarksChange = (studentId: number, remarks: string) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, remarks } : s
      )
    );
  };

  const handleSaveMarks = () => {
    if (!selectedTest) return;

    // Validate all marks are filled
    const incomplete = students.filter((s) => !s.marks);
    if (incomplete.length > 0) {
      toast.error(`Please enter marks for all students (${incomplete.length} remaining)`);
      return;
    }

    // Validate marks don't exceed max
    const invalid = students.filter((s) => parseInt(s.marks) > selectedTest.maxMarks);
    if (invalid.length > 0) {
      toast.error(`Some marks exceed maximum (${selectedTest.maxMarks})`);
      return;
    }

    setShowSuccess(true);
    toast.success("Marks saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enter Marks</h1>
        <p className="text-muted-foreground">Record test scores for your students</p>
      </div>

      {/* Test Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Select Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Choose a test to enter marks</Label>
            <Select onValueChange={handleSelectTest}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {mockTests.map((test) => (
                  <SelectItem key={test.id} value={test.id.toString()}>
                    {test.name} ({test.class} - {test.section}) - Max: {test.maxMarks}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Marks Entry Table */}
      {selectedTest && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  {selectedTest.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Class: {selectedTest.class} - {selectedTest.section}</Badge>
                    <Badge variant="secondary">Maximum Marks: {selectedTest.maxMarks}</Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {students.length} Students
                    </Badge>
                  </div>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  All marks have been saved successfully for {selectedTest.name}.
                </AlertDescription>
              </Alert>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-20">Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="w-32">Marks (/{selectedTest.maxMarks})</TableHead>
                    <TableHead className="w-48">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono">{student.roll}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={selectedTest.maxMarks}
                          placeholder="0"
                          value={student.marks}
                          onChange={(e) => handleMarksChange(student.id, e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={student.remarks}
                          onValueChange={(v) => handleRemarksChange(student.id, v)}
                        >
                          <SelectTrigger className="w-44">
                            <SelectValue placeholder="Select remarks" />
                          </SelectTrigger>
                          <SelectContent>
                            {remarkOptions.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveMarks} size="lg">
                <Save className="h-4 w-4 mr-2" />
                Save Marks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedTest && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <PenLine className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Test Selected</h3>
            <p className="text-muted-foreground">
              Please select a test from above to start entering marks.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
