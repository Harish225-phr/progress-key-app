import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { 
  attendanceService, 
  type Enrollment, 
  type AttendanceSummary, 
  type BulkAttendanceData,
  type AttendanceStatus 
} from "@/services/attendanceService";
import { getClasses } from "@/services/classService";
import { getSectionsByClassId } from "@/services/classService";
import { academicYearService } from "@/services/academicYearService";

export default function AttendanceMarking() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendanceData, setAttendanceData] = useState<{ [key: string]: AttendanceStatus }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  
  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    sectionId: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string; isActive: boolean }[]>([]);

  // Load academic years on mount
  useEffect(() => {
    const loadAcademicYears = async () => {
      try {
        const yearsData = await academicYearService.getList();
        setAcademicYears(yearsData.map(year => ({ 
          id: year.id, 
          name: year.name, 
          isActive: year.isActive 
        })));
        
        // Set current academic year as default
        const currentYear = yearsData.find(year => year.isActive);
        if (currentYear) {
          setFilters(prev => ({ ...prev, academicYearId: currentYear.id }));
        }
      } catch (error) {
        console.error('Failed to load academic years:', error);
        toast.error('Failed to load academic years');
      }
    };
    loadAcademicYears();
  }, []);

  // Load classes when academic year changes
  useEffect(() => {
    if (filters.academicYearId) {
      const loadClasses = async () => {
        try {
          const classesData = await getClasses();
          setClasses(classesData.map(c => ({ id: c.id, name: c.name })));
        } catch (error) {
          console.error('Failed to load classes:', error);
          toast.error('Failed to load classes');
        }
      };
      loadClasses();
    }
  }, [filters.academicYearId]);

  // Load sections when class changes
  useEffect(() => {
    if (filters.classId) {
      const loadSections = async () => {
        try {
          const sectionsData = await getSectionsByClassId(filters.classId);
          setSections(sectionsData.map(s => ({ id: s.id, name: s.name })));
        } catch (error) {
          console.error('Failed to load sections:', error);
          toast.error('Failed to load sections');
        }
      };
      loadSections();
    }
  }, [filters.classId]);

  // Load enrollments and existing attendance when all filters are set
  useEffect(() => {
    if (filters.academicYearId && filters.classId && filters.sectionId) {
      loadEnrollments();
      loadExistingAttendance();
    }
  }, [filters]);

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const enrollmentsData = await attendanceService.getEnrollments({
        academicYearId: filters.academicYearId,
        classId: filters.classId,
        sectionId: filters.sectionId
      });
      
      setEnrollments(enrollmentsData);
      
      // Initialize attendance data with default status
      const initialAttendance: { [key: string]: AttendanceStatus } = {};
      enrollmentsData.forEach(enrollment => {
        initialAttendance[enrollment._id] = 'Present'; // Default status
      });
      setAttendanceData(initialAttendance);
      
    } catch (error) {
      console.error('Failed to load enrollments:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      const summaryData = await attendanceService.getClassSummary({
        academicYearId: filters.academicYearId,
        classId: filters.classId,
        sectionId: filters.sectionId,
        date: filters.date
      });
      
      setSummary(summaryData);
      
      // Update attendance data with existing records
      if (summaryData.attendance && summaryData.attendance.length > 0) {
        const existingAttendance: { [key: string]: AttendanceStatus } = {};
        summaryData.attendance.forEach(record => {
          existingAttendance[record.enrollmentId] = record.status;
        });
        setAttendanceData(prev => ({ ...prev, ...existingAttendance }));
      }
      
    } catch (error) {
      console.error('Failed to load existing attendance:', error);
      // Don't show error for missing attendance (first time marking)
    }
  };

  const handleStatusChange = (enrollmentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [enrollmentId]: status
    }));
  };

  const handleBulkStatusChange = (status: AttendanceStatus) => {
    const updatedData: { [key: string]: AttendanceStatus } = {};
    Object.keys(attendanceData).forEach(enrollmentId => {
      updatedData[enrollmentId] = status;
    });
    setAttendanceData(updatedData);
  };

  const markAttendance = async () => {
    setSaving(true);
    try {
      const attendanceRecords = Object.entries(attendanceData).map(([enrollmentId, status]) => ({
        enrollmentId,
        studentId: enrollments.find(e => e._id === enrollmentId)?.studentId._id || '',
        status
      }));
      
      const bulkData: BulkAttendanceData = {
        academicYearId: filters.academicYearId,
        classId: filters.classId,
        sectionId: filters.sectionId,
        date: filters.date,
        attendanceRecords
      };
      
      const result = await attendanceService.markAttendance(bulkData);
      
      toast.success(`Attendance marked successfully for ${result.totalMarked} students`);
      
      // Reload existing attendance to update summary
      await loadExistingAttendance();
      
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case 'Present': return 'default';
      case 'Absent': return 'destructive';
      case 'Leave': return 'secondary';
      case 'Late': return 'outline';
      case 'Excused': return 'secondary';
      default: return 'outline';
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    
    // Reset dependent fields
    if (field === 'academicYearId') {
      newFilters.classId = '';
      newFilters.sectionId = '';
    } else if (field === 'classId') {
      newFilters.sectionId = '';
    }
    
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">Mark attendance for students in selected class and section</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select
                value={filters.academicYearId}
                onValueChange={(value) => handleFilterChange('academicYearId', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select academic year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map(year => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name} {year.isActive && '(Current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={filters.classId}
                onValueChange={(value) => handleFilterChange('classId', value)}
                disabled={loading || !filters.academicYearId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Section</Label>
              <Select
                value={filters.sectionId}
                onValueChange={(value) => handleFilterChange('sectionId', value)}
                disabled={loading || !filters.classId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Summary for {filters.date}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{summary.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.present}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{summary.leave}</div>
                <div className="text-sm text-gray-600">Leave</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{summary.late}</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions */}
      {enrollments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="font-medium">Bulk Mark:</span>
              <Button 
                variant="default" 
                onClick={() => handleBulkStatusChange('Present')}
                disabled={saving}
              >
                All Present
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleBulkStatusChange('Absent')}
                disabled={saving}
              >
                All Absent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student List */}
      {enrollments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students ({enrollments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No.</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow key={enrollment._id}>
                    <TableCell>{enrollment.rollNumber || '-'}</TableCell>
                    <TableCell>{enrollment.studentId.admissionNumber}</TableCell>
                    <TableCell className="font-medium">
                      {enrollment.studentId.firstName} {enrollment.studentId.lastName}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={attendanceData[enrollment._id] || 'Present'}
                        onValueChange={(value: AttendanceStatus) => handleStatusChange(enrollment._id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Present">Present</SelectItem>
                          <SelectItem value="Absent">Absent</SelectItem>
                          <SelectItem value="Leave">Leave</SelectItem>
                          <SelectItem value="Late">Late</SelectItem>
                          <SelectItem value="Excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {enrollments.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <Button
                onClick={markAttendance}
                disabled={saving || enrollments.length === 0}
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Mark Attendance'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Students Message */}
      {!loading && enrollments.length === 0 && filters.academicYearId && filters.classId && filters.sectionId && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">No students found in this class and section.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
