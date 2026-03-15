import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, CheckCircle, Users, AlertCircle, Clock, Loader2 } from "lucide-react";
import { attendanceService, type Enrollment, type AttendanceStatus } from "@/services/attendanceService";
import { classTeacherService } from "@/services/classTeacherService";
import { studentService } from "@/services/studentService";
import { useAcademicYear } from "@/hooks/useAcademicYear";

interface AttendanceRecord {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  rollNumber?: string;
  status: AttendanceStatus;
}

export default function MarkAttendance() {
  const { current: currentAcademicYear } = useAcademicYear({ fetchListOnMount: true });
  const [students, setStudents] = useState<Enrollment[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [myAssignment, setMyAssignment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [existingAttendance, setExistingAttendance] = useState<Record<string, AttendanceStatus>>({});

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate, currentAcademicYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      console.log("Current academic year:", currentAcademicYear);
      
      if (!currentAcademicYear) {
        console.log("No academic year available, waiting...");
        setLoading(false);
        return;
      }
      
      // Get teacher's assigned class
      const assignments = await classTeacherService.getMyClasses();
      
      if (assignments.length === 0) {
        setLoading(false);
        return;
      }
      
      const assignment = assignments[0];
      setMyAssignment(assignment);

      // Get students for the assigned class using admission API (backend filters by teacher's assignment)
      const studentsData = await studentService.getAll();
      
      console.log("Students for attendance:", studentsData);
      
      // Convert students to enrollment-like format for attendance
      const enrollmentLikeStudents = studentsData.map(student => ({
        _id: student.id,
        studentId: {
          _id: student.id,
          firstName: student.name.split(' ')[0] || '',
          lastName: student.name.split(' ').slice(1).join(' ') || '',
          admissionNumber: student.admissionNumber,
        },
        rollNumber: student.rollNumber || undefined,
      }));

      console.log("Converted enrollment data:", enrollmentLikeStudents);
      setStudents(enrollmentLikeStudents);

      // Check if attendance already exists for this date
      try {
        const attendanceSummary = await attendanceService.getClassSummary({
          academicYearId: currentAcademicYear._id,
          classId: assignment.classId,
          sectionId: assignment.sectionId,
          date: selectedDate,
        });

        console.log("Existing attendance summary:", attendanceSummary);

        // Set existing attendance
        const existing: Record<string, AttendanceStatus> = {};
        attendanceSummary.attendance.forEach(record => {
          existing[record.enrollmentId] = record.status;
        });
        setExistingAttendance(existing);
        setAttendance(existing);
      } catch (error) {
        console.log("No existing attendance for this date");
        // No existing attendance, start fresh
        setAttendance({});
        setExistingAttendance({});
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  const updateAttendanceStatus = (enrollmentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({
      ...prev,
      [enrollmentId]: status,
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, AttendanceStatus> = {};
    students.forEach((student) => {
      allPresent[student._id] = "Present";
    });
    setAttendance(allPresent);
    toast.success("Marked all students present");
  };

  const markAllAbsent = () => {
    const allAbsent: Record<string, AttendanceStatus> = {};
    students.forEach((student) => {
      allAbsent[student._id] = "Absent";
    });
    setAttendance(allAbsent);
    toast.success("Marked all students absent");
  };

  const handleSubmit = async () => {
    if (!myAssignment || !currentAcademicYear) {
      toast.error("Missing assignment or academic year information");
      return;
    }

    const attendanceRecords = students.map(student => ({
      enrollmentId: student._id,
      studentId: student.studentId._id,
      status: attendance[student._id] || "Absent",
    }));

    setSubmitting(true);
    try {
      const result = await attendanceService.markAttendance({
        academicYearId: currentAcademicYear._id,
        classId: myAssignment.classId,
        sectionId: myAssignment.sectionId,
        date: selectedDate,
        attendance: attendanceRecords,
      });

      toast.success(`Attendance submitted! ${result.data.markedAttendance} students marked`);
      
      // Update existing attendance
      setExistingAttendance(attendance);
    } catch (error) {
      console.error("Failed to submit attendance:", error);
      toast.error("Failed to submit attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "Present": return "text-green-600 bg-green-50";
      case "Absent": return "text-red-600 bg-red-50";
      case "Late": return "text-orange-600 bg-orange-50";
      case "Leave": return "text-blue-600 bg-blue-50";
      case "Excused": return "text-purple-600 bg-purple-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const presentCount = Object.values(attendance).filter(status => status === "Present").length;
  const absentCount = Object.values(attendance).filter(status => status === "Absent").length;
  const lateCount = Object.values(attendance).filter(status => status === "Late").length;
  const leaveCount = Object.values(attendance).filter(status => status === "Leave").length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
            <p className="text-muted-foreground">Mark today's attendance for your class</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!myAssignment || !currentAcademicYear) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground">Mark today's attendance for your class</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Attendance</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {(!myAssignment && "You are not assigned to any class/section.") ||
               (!currentAcademicYear && "No active academic year found.") ||
               "Please contact your school administrator."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Class {myAssignment.className || myAssignment.classId} - Section {myAssignment.sectionName || myAssignment.sectionId}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Date: {new Date(selectedDate).toLocaleDateString()}
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{today}</div>
            <div className="text-xs text-muted-foreground">
              {Object.keys(existingAttendance).length > 0 ? "Already marked" : "Not marked yet"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <div className="text-xs text-muted-foreground">Students present</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <div className="text-xs text-muted-foreground">Students absent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Other</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lateCount + leaveCount}</div>
            <div className="text-xs text-muted-foreground">Late/Leave</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student List ({students.length})</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAbsent}>
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => {
              console.log("Rendering student:", student);
              return (
              <div
                key={student._id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">
                        {student.studentId?.firstName} {student.studentId?.lastName || 'Unknown Student'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Roll No: {student.rollNumber || "N/A"} | Admission: {student.studentId?.admissionNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={attendance[student._id] || "Absent"}
                    onValueChange={(value: AttendanceStatus) => updateAttendanceStatus(student._id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Late">Late</SelectItem>
                      <SelectItem value="Leave">Leave</SelectItem>
                      <SelectItem value="Excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(attendance[student._id] || "Absent")}
                  >
                    {attendance[student._id] || "Absent"}
                  </Badge>
                </div>
              </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={submitting || students.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Attendance ({Object.keys(attendance).length})
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setAttendance(existingAttendance)}
              disabled={Object.keys(existingAttendance).length === 0}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
