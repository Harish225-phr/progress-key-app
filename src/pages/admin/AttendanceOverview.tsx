import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  BookOpen,
  Eye,
  Loader2,
  Search,
  ChevronDown,
  ChevronRight,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { attendanceService, type Enrollment } from "@/services/attendanceService";
import { academicYearService } from "@/services/academicYearService";

export default function AttendanceOverview() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set());

  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([]);

  // Load academic years
  useEffect(() => {
    const loadAcademicYears = async () => {
      try {
        const yearsData = await academicYearService.getList();
        setAcademicYears(yearsData.map((y) => ({ id: y.id, name: y.name })));

        // Set current academic year if available
        const currentYear = yearsData.find((y) => y.isCurrent);
        if (currentYear) {
          setSelectedAcademicYear(currentYear.id);
        }
      } catch (error) {
        toast.error("Failed to load academic years");
      }
    };

    loadAcademicYears();
  }, []);

  // Load all enrollments when academic year changes
  useEffect(() => {
    if (selectedAcademicYear) {
      loadAllEnrollments();
    }
  }, [selectedAcademicYear]);

  const loadAllEnrollments = async () => {
    if (!selectedAcademicYear) return;

    setLoading(true);
    try {
      const data = await attendanceService.getAllEnrollments(selectedAcademicYear);
      setEnrollments(data);
      toast.success(`Loaded ${data.length} enrollments`);
    } catch (error) {
      toast.error("Failed to load enrollments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter enrollments based on search
  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    const studentName = `${enrollment.studentId?.firstName || ''} ${enrollment.studentId?.lastName || ''}`.trim();
    const className = enrollment.classId?.name || '';
    const sectionName = enrollment.sectionId?.name || '';
    const admissionNumber = enrollment.studentId?.admissionNumber || '';
    
    return (
      studentName.toLowerCase().includes(searchLower) ||
      admissionNumber.toLowerCase().includes(searchLower) ||
      className.toLowerCase().includes(searchLower) ||
      sectionName.toLowerCase().includes(searchLower)
    );
  });

  // Group enrollments by class and section
  const groupedEnrollments = filteredEnrollments.reduce((acc, enrollment) => {
    const className = enrollment.classId?.name || "Unknown Class";
    if (!acc[className]) {
      acc[className] = {};
    }
    const sectionName = enrollment.sectionId?.name || "Unknown Section";
    if (!acc[className][sectionName]) {
      acc[className][sectionName] = [];
    }
    acc[className][sectionName].push(enrollment);
    return acc;
  }, {} as Record<string, Record<string, Enrollment[]>>);

  // Calculate statistics
  const totalStudents = filteredEnrollments.length;
  const totalClasses = Object.keys(groupedEnrollments).length;
  const totalSections = Object.values(groupedEnrollments).reduce(
    (total, sections) => total + Object.keys(sections).length,
    0
  );

  const toggleClass = (className: string) => {
    const newExpanded = new Set(expandedClasses);
    if (newExpanded.has(className)) {
      newExpanded.delete(className);
    } else {
      newExpanded.add(className);
    }
    setExpandedClasses(newExpanded);
  };

  const expandAll = () => {
    setExpandedClasses(new Set(Object.keys(groupedEnrollments)));
  };

  const collapseAll = () => {
    setExpandedClasses(new Set());
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">📚 School Attendance Overview</h1>
          <p className="text-muted-foreground">
            Complete view of all student enrollments for attendance management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={expandAll}>
            <ChevronDown className="h-4 w-4 mr-2" />
            Expand All
          </Button>
          <Button variant="outline" onClick={collapseAll}>
            <ChevronRight className="h-4 w-4 mr-2" />
            Collapse All
          </Button>
          <Button onClick={() => window.open("/admin/attendance/marking", "_blank")}>
            <UserCheck className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* Academic Year Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Academic Year
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="🎓 Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id} className="text-lg">
                      🎓 {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedAcademicYear && (
              <Button onClick={loadAllEnrollments} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Load Students
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {selectedAcademicYear && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Classes</p>
                  <p className="text-2xl font-bold text-blue-800">{totalClasses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Sections</p>
                  <p className="text-2xl font-bold text-green-800">{totalSections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Total Students</p>
                  <p className="text-2xl font-bold text-purple-800">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      {enrollments.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="🔍 Search students by name, admission number, class, or section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-muted-foreground mt-2">
                Found {filteredEnrollments.length} students matching "{searchTerm}"
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Enrollments Display */}
      {selectedAcademicYear && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Student Enrollments ({filteredEnrollments.length})
              {selectedAcademicYear && (
                <Badge variant="outline" className="ml-2">
                  {academicYears.find((y) => y.id === selectedAcademicYear)?.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="ml-3 text-lg">Loading enrollments...</p>
              </div>
            ) : filteredEnrollments.length === 0 ? (
              <div className="text-center py-12">
                {searchTerm ? (
                  <>
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <p className="text-lg font-medium mb-2">No students found</p>
                    <p className="text-muted-foreground">
                      Try different search terms or clear the search
                    </p>
                  </>
                ) : (
                  <>
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No enrollments found</p>
                    <p className="text-muted-foreground">
                      Select an academic year to view enrollments
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(groupedEnrollments).map(([className, sections]) => (
                  <div key={className} className="border rounded-lg overflow-hidden">
                    {/* Class Header */}
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => toggleClass(className)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedClasses.has(className) ? (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-600" />
                        )}
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{className}</h3>
                        <Badge variant="secondary">
                          {Object.values(sections).reduce((total, sec) => total + sec.length, 0)} students
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {Object.keys(sections).length} sections
                      </Badge>
                    </div>

                    {/* Sections and Students */}
                    {expandedClasses.has(className) && (
                      <div className="p-4 space-y-4">
                        {Object.entries(sections).map(([sectionName, students]) => (
                          <div key={sectionName} className="border-l-4 border-blue-200 pl-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="h-4 w-4 text-green-600" />
                              <h4 className="font-medium text-lg">{sectionName}</h4>
                              <Badge variant="secondary">{students.length} students</Badge>
                            </div>

                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="font-semibold">Admission No.</TableHead>
                                  <TableHead className="font-semibold">Student Name</TableHead>
                                  <TableHead className="font-semibold">Roll No.</TableHead>
                                  <TableHead className="font-semibold">Status</TableHead>
                                  <TableHead className="font-semibold">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {students.map((student) => {
                                  const studentName = `${student.studentId?.firstName || ''} ${student.studentId?.lastName || ''}`.trim();
                                  const admissionNumber = student.studentId?.admissionNumber || '';
                                  
                                  return (
                                    <TableRow key={student._id} className="hover:bg-gray-50">
                                      <TableCell className="font-medium">
                                        {admissionNumber}
                                      </TableCell>
                                      <TableCell className="font-medium">
                                        {studentName}
                                      </TableCell>
                                      <TableCell>{student.rollNumber}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={
                                            student.status === "active"
                                              ? "default"
                                              : "secondary"
                                          }
                                        >
                                          {student.status || "active"}
                                        </Badge>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline">
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                          </Button>
                                          <Button size="sm">
                                            <UserCheck className="h-3 w-3 mr-1" />
                                            Mark
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
