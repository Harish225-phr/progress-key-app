import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, Loader2, Trash2, PenLine } from "lucide-react";
import { toast } from "sonner";
import { examService, type Exam, type ExamData } from "@/services/examService";
import { resultService, type Result, type ResultData } from "@/services/resultService";
import { getClasses } from "@/services/classService";
import { studentService, type Student } from "@/services/studentService";
import { subjectService, type Subject } from "@/services/subjectService";
import { useAcademicYear } from "@/hooks/useAcademicYear";



export default function Marks() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [marksDialogOpen, setMarksDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMarksSubmitting, setIsMarksSubmitting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [resultsLoading, setResultsLoading] = useState(true);
  const { list: academicYears, current: currentYear } = useAcademicYear();
  const defaultAcademicYear = currentYear?.name ?? currentYear?.id ?? "";
  const [formData, setFormData] = useState<ExamData>({
    name: "",
    classId: "",
    academicYear: defaultAcademicYear,
    examDate: "",
  });
  const [marksFormData, setMarksFormData] = useState<ResultData>({
    studentId: "",
    examId: "",
    subjectId: "",
    marksObtained: 0,
    maxMarks: 100,
    grade: "",
    remarks: "",
  });

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchStudents();
    fetchSubjects();
    fetchResults();
  }, []);

  useEffect(() => {
    if (defaultAcademicYear && !formData.academicYear) {
      setFormData((prev) => ({ ...prev, academicYear: defaultAcademicYear }));
    }
  }, [defaultAcademicYear]);

  const fetchExams = async () => {
    try {
      const data = await examService.getAll();
      setExams(data);
    } catch {
      toast.error("Failed to fetch exams");
    } finally {
      setExamsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await getClasses();
      setClasses(data.map((c) => ({ id: c.id, name: c.name })));
    } catch {
      toast.error("Failed to fetch classes");
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch {
      toast.error("Failed to fetch students");
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAll();
      setSubjects(data);
    } catch {
      toast.error("Failed to fetch subjects");
    }
  };

  const fetchResults = async () => {
    try {
      const data = await resultService.getAll();
      setResults(data);
    } catch {
      toast.error("Failed to fetch results");
    } finally {
      setResultsLoading(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Exam name is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Please select a class");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: ExamData = {
        name: formData.name,
        classId: formData.classId,
        ...(formData.academicYear ? { academicYear: formData.academicYear } : {}),
        ...(formData.examDate ? { examDate: formData.examDate } : {}),
      };
      const newExam = await examService.create(payload);
      setExams((prev) => [...prev, newExam]);
      toast.success("Exam created successfully!");
      setDialogOpen(false);
      setFormData({ name: "", classId: "", academicYear: defaultAcademicYear, examDate: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create exam";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await examService.delete(examId);
        setExams((prev) => prev.filter((e) => e.id !== examId));
        toast.success("Exam deleted successfully!");
      } catch {
        toast.error("Failed to delete exam");
      }
    }
  };

  const handleAddMarks = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!marksFormData.studentId) {
      toast.error("Please select a student");
      return;
    }

    if (!marksFormData.examId) {
      toast.error("Please select an exam");
      return;
    }

    if (!marksFormData.subjectId) {
      toast.error("Please select a subject");
      return;
    }

    if (marksFormData.marksObtained < 0) {
      toast.error("Marks cannot be negative");
      return;
    }

    if (marksFormData.maxMarks <= 0) {
      toast.error("Max marks must be greater than 0");
      return;
    }

    setIsMarksSubmitting(true);

    try {
      const newResult = await resultService.create(marksFormData);
      setResults((prev) => [...prev, newResult]);
      toast.success("Marks added successfully!");
      setMarksDialogOpen(false);
      setMarksFormData({
        studentId: "",
        examId: "",
        subjectId: "",
        marksObtained: 0,
        maxMarks: 100,
        grade: "",
        remarks: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add marks";
      toast.error(errorMessage);
    } finally {
      setIsMarksSubmitting(false);
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await resultService.delete(resultId);
        setResults((prev) => prev.filter((r) => r.id !== resultId));
        toast.success("Result deleted successfully!");
      } catch {
        toast.error("Failed to delete result");
      }
    }
  };

  const getClassName = (exam: Exam) => {
    if (exam.className) return exam.className;
    const cls = classes.find((c) => c.id === exam.classId);
    return cls?.name ?? exam.classId;
  };

  const getStudentName = (result: Result) => {
    if (result.studentName) return result.studentName;
    const student = students.find((s) => s.id === result.studentId);
    return student ? `${student.firstName} ${student.lastName}` : result.studentId;
  };

  const getExamName = (result: Result) => {
    if (result.examName) return result.examName;
    const exam = exams.find((e) => e.id === result.examId);
    return exam?.name ?? result.examId;
  };

  const getSubjectName = (result: Result) => {
    if (result.subjectName) return result.subjectName;
    const subject = subjects.find((s) => s.id === result.subjectId);
    return subject?.name ?? result.subjectId;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exams & Marks</h1>
          <p className="text-muted-foreground">Manage exams and view student performance</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={marksDialogOpen} onOpenChange={setMarksDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PenLine className="h-4 w-4 mr-2" />
                Add Marks
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Student Marks</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddMarks} className="space-y-4">
                <div>
                  <Label htmlFor="studentId">Student *</Label>
                  <Select
                    value={marksFormData.studentId}
                    onValueChange={(value) => setMarksFormData({ ...marksFormData, studentId: value })}
                    disabled={isMarksSubmitting}
                  >
                    <SelectTrigger id="studentId">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="examIdMarks">Exam *</Label>
                  <Select
                    value={marksFormData.examId}
                    onValueChange={(value) => setMarksFormData({ ...marksFormData, examId: value })}
                    disabled={isMarksSubmitting}
                  >
                    <SelectTrigger id="examIdMarks">
                      <SelectValue placeholder="Select exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subjectId">Subject *</Label>
                  <Select
                    value={marksFormData.subjectId}
                    onValueChange={(value) => setMarksFormData({ ...marksFormData, subjectId: value })}
                    disabled={isMarksSubmitting}
                  >
                    <SelectTrigger id="subjectId">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marksObtained">Marks Obtained *</Label>
                    <Input
                      id="marksObtained"
                      type="number"
                      min="0"
                      value={marksFormData.marksObtained}
                      onChange={(e) => setMarksFormData({ ...marksFormData, marksObtained: Number(e.target.value) })}
                      disabled={isMarksSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxMarks">Max Marks *</Label>
                    <Input
                      id="maxMarks"
                      type="number"
                      min="1"
                      value={marksFormData.maxMarks}
                      onChange={(e) => setMarksFormData({ ...marksFormData, maxMarks: Number(e.target.value) })}
                      disabled={isMarksSubmitting}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    placeholder="e.g., A, B+, C"
                    value={marksFormData.grade}
                    onChange={(e) => setMarksFormData({ ...marksFormData, grade: e.target.value })}
                    disabled={isMarksSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="remarks">Remarks</Label>
                  <Input
                    id="remarks"
                    placeholder="Optional remarks"
                    value={marksFormData.remarks}
                    onChange={(e) => setMarksFormData({ ...marksFormData, remarks: e.target.value })}
                    disabled={isMarksSubmitting}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isMarksSubmitting}>
                  {isMarksSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Marks...
                    </>
                  ) : (
                    "Add Marks"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddExam} className="space-y-4">
              <div>
                <Label htmlFor="examName">Exam Name *</Label>
                <Input
                  id="examName"
                  placeholder="e.g., Mid Term Exam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) => setFormData({ ...formData, classId: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="classId">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={formData.academicYear || defaultAcademicYear}
                  onValueChange={(value) => setFormData({ ...formData, academicYear: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="academicYear">
                    <SelectValue placeholder="Current year (default)" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((ay) => (
                      <SelectItem key={ay.id} value={ay.name || ay.id}>
                        {ay.name || ay.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Leave default for current year</p>
              </div>
              <div>
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Exam"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Exams List */}
      <Card>
        <CardHeader>
          <CardTitle>Exams ({exams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {examsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No exams found. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Exam Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{getClassName(exam)}</TableCell>
                    <TableCell>{exam.academicYear}</TableCell>
                    <TableCell>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
          <CardTitle>Student Results ({results.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {resultsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results found. Add marks to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Exam</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => {
                  const percentage = result.maxMarks > 0 ? (result.marksObtained / result.maxMarks) * 100 : 0;
                  return (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{getStudentName(result)}</TableCell>
                      <TableCell>{getExamName(result)}</TableCell>
                      <TableCell>{getSubjectName(result)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{result.marksObtained}</span>
                        <span className="text-muted-foreground">/{result.maxMarks}</span>
                      </TableCell>
                      <TableCell>
                        {result.grade && <Badge variant="secondary">{result.grade}</Badge>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={percentage >= 90 ? "default" : percentage >= 75 ? "secondary" : "outline"}>
                          {percentage.toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
