import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, User, Calendar, BookOpen, DollarSign, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { studentService, type StudentProfile, type AttendanceRecord, type ExamResult, type FeeRecord } from "@/services/studentService";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (!studentId) {
      toast.error("Student ID is required");
      navigate("/admin/students");
      return;
    }

    const fetchStudentProfile = async () => {
      try {
        const studentData = await studentService.getProfile(studentId);
        setStudent(studentData);
      } catch (error) {
        toast.error("Failed to load student profile");
        navigate("/admin/students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId, navigate]);

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "leave":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      "A+": "text-green-600 bg-green-100",
      A: "text-green-600 bg-green-100",
      "B+": "text-blue-600 bg-blue-100",
      B: "text-blue-600 bg-blue-100",
      "C+": "text-yellow-600 bg-yellow-100",
      C: "text-yellow-600 bg-yellow-100",
      D: "text-orange-600 bg-orange-100",
      F: "text-red-600 bg-red-100",
    };
    return gradeColors[grade] || "text-gray-600 bg-gray-100";
  };

  const getFeeStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      paid: "default",
      pending: "secondary",
      overdue: "destructive",
      partial: "outline",
    };
    return statusColors[status] || "secondary";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAttendancePercentage = (attendance: AttendanceRecord[]) => {
    if (attendance.length === 0) return 0;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Student not found</p>
        <Button className="mt-4" onClick={() => navigate("/admin/students")}>
          Back to Students
        </Button>
      </div>
    );
  }

  const attendancePercentage = calculateAttendancePercentage(student.attendance);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Student Profile</h1>
          <p className="text-muted-foreground">
            {student.admissionNumber} - {student.name}
          </p>
        </div>
      </div>

      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Full Name</h4>
              <p className="font-medium">{student.name}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Email</h4>
              <p className="font-medium">{student.email}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Admission Number</h4>
              <p className="font-medium">{student.admissionNumber}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Date of Birth</h4>
              <p className="font-medium">{formatDate(student.dob)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Gender</h4>
              <p className="font-medium capitalize">{student.gender}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Parent Name</h4>
              <p className="font-medium">{student.parentName || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Current Class</h4>
              <p className="font-medium">{student.className || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Section</h4>
              <p className="font-medium">{student.sectionName || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Roll Number</h4>
              <p className="font-medium">{student.rollNumber}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Status</h4>
              <Badge
                variant={
                  student.status === "active"
                    ? "default"
                    : student.status === "graduated"
                    ? "secondary"
                    : "outline"
                }
              >
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Enrollment
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Fees
          </TabsTrigger>
        </TabsList>

        {/* Enrollment History */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment History</CardTitle>
            </CardHeader>
            <CardContent>
              {student.enrollments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No enrollment history available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>{enrollment.academicYearName}</TableCell>
                          <TableCell>{enrollment.className}</TableCell>
                          <TableCell>{enrollment.sectionName}</TableCell>
                          <TableCell>{enrollment.rollNumber}</TableCell>
                          <TableCell>{formatDate(enrollment.enrollmentDate)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                enrollment.status === "active"
                                  ? "default"
                                  : enrollment.status === "completed"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Records */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Records</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Overall Attendance:</span>
                  <Badge
                    variant={
                      attendancePercentage >= 90
                        ? "default"
                        : attendancePercentage >= 75
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {attendancePercentage}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.attendance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No attendance records available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.attendance.slice(0, 50).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getAttendanceIcon(record.status)}
                              <span className="capitalize">{record.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{record.subject || "-"}</TableCell>
                          <TableCell>{record.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exam Results */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              {student.results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No exam results available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Total Marks</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Exam Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.results.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.examName}</TableCell>
                          <TableCell>{result.subjectName}</TableCell>
                          <TableCell>{result.marks}</TableCell>
                          <TableCell>{result.totalMarks}</TableCell>
                          <TableCell>{result.percentage}%</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(
                                result.grade
                              )}`}
                            >
                              {result.grade}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(result.examDate)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee Records */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Records</CardTitle>
            </CardHeader>
            <CardContent>
              {student.feeRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fee records available</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paid Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {student.feeRecords.map((fee) => (
                        <TableRow key={fee.id}>
                          <TableCell className="font-medium">{fee.feeType}</TableCell>
                          <TableCell>${fee.amount}</TableCell>
                          <TableCell>{formatDate(fee.dueDate)}</TableCell>
                          <TableCell>{fee.paidDate ? formatDate(fee.paidDate) : "-"}</TableCell>
                          <TableCell>
                            <Badge variant={getFeeStatusColor(fee.status)}>
                              {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {fee.paidAmount ? `$${fee.paidAmount}` : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
