import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Search, Eye, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { studentService, type Student } from "@/services/studentService";
import { getClasses } from "@/services/classService";
import { academicYearService } from "@/services/academicYearService";
import { useNavigate } from "react-router-dom";

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    sectionId: "",
  });

  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesData, academicYearsData] = await Promise.all([
          getClasses(),
          academicYearService.getAll(),
        ]);

        setClasses(classesData.map((c) => ({ id: c.id, name: c.name })));
        setAcademicYears(academicYearsData.map((ay) => ({ id: ay.id, name: ay.name })));
      } catch (error) {
        toast.error("Failed to load initial data");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (filters.classId) {
      const fetchSections = async () => {
        try {
          const { getSectionsByClassId } = await import("@/services/classService");
          const sectionsData = await getSectionsByClassId(filters.classId);
          setSections(sectionsData.map((s) => ({ id: s.id, name: s.name })));
        } catch (error) {
          toast.error("Failed to load sections");
        }
      };

      fetchSections();
    } else {
      setSections([]);
    }
  }, [filters.classId]);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const activeFilters = {
        academicYearId: filters.academicYearId || undefined,
        classId: filters.classId || undefined,
        sectionId: filters.sectionId || undefined,
      };

      const studentsData = await studentService.getAll(activeFilters);
      setStudents(studentsData);
    } catch (error) {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
      ...(filterType === "classId" ? { sectionId: "" } : {}), // Reset section when class changes
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call the API with search term
    // For now, we'll filter locally
    if (searchTerm.trim()) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setStudents(filtered);
    } else {
      fetchStudents();
    }
  };

  const getStudentStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      graduated: "success",
      transferred: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredStudents = students.filter((student) => {
    if (!searchTerm.trim()) return true;
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground">Manage student admissions and records</p>
        </div>
        <Button onClick={() => navigate("/admin/students/admission")}>
          <Plus className="h-4 w-4 mr-2" />
          Admit Student
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={filters.academicYearId}
                  onValueChange={(value) => handleFilterChange("academicYearId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Academic Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Academic Years</SelectItem>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="class">Class</Label>
                <Select
                  value={filters.classId}
                  onValueChange={(value) => handleFilterChange("classId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="section">Section</Label>
                <Select
                  value={filters.sectionId}
                  onValueChange={(value) => handleFilterChange("sectionId", value)}
                  disabled={!filters.classId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !filters.classId
                          ? "Select class first"
                          : "All Sections"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search">Search</Label>
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    id="search"
                    placeholder="Search by name, email, or admission number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
              {filters.academicYearId && (
                <Badge variant="secondary">
                  Year: {academicYears.find((y) => y.id === filters.academicYearId)?.name}
                </Badge>
              )}
              {filters.classId && (
                <Badge variant="secondary">
                  Class: {classes.find((c) => c.id === filters.classId)?.name}
                </Badge>
              )}
              {filters.sectionId && (
                <Badge variant="secondary">
                  Section: {sections.find((s) => s.id === filters.sectionId)?.name}
                </Badge>
              )}
              {(filters.academicYearId || filters.classId || filters.sectionId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters({ academicYearId: "", classId: "", sectionId: "" })}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No students found</p>
              <p>
                {searchTerm.trim()
                  ? "Try adjusting your search terms"
                  : filters.academicYearId || filters.classId || filters.sectionId
                  ? "Try adjusting your filters"
                  : "Start by admitting a new student"}
              </p>
              {!searchTerm.trim() && !filters.academicYearId && !filters.classId && !filters.sectionId && (
                <Button
                  className="mt-4"
                  onClick={() => navigate("/admin/students/admission")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Admit First Student
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admission No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.admissionNumber}
                      </TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        {student.className || student.classId || "-"}
                      </TableCell>
                      <TableCell>
                        {student.sectionName || student.sectionId || "-"}
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>
                        {getStudentStatusBadge(student.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                            title="View student profile"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
