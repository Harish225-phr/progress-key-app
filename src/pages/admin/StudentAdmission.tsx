import { useState, useEffect } from "react";
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
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { studentService, type StudentAdmissionData } from "@/services/studentService";
import { getClasses } from "@/services/classService";
import { getSectionsByClassId } from "@/services/classService";
import { academicYearService } from "@/services/academicYearService";
import { userService, type User } from "@/services/userService";
import { useNavigate } from "react-router-dom";

export default function StudentAdmission() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<StudentAdmissionData>({
    name: "",
    email: "",
    password: "",
    admissionNumber: "",
    dob: "",
    gender: "male",
    parentId: "",
    academicYearId: "",
    classId: "",
    sectionId: "",
    rollNumber: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, academicYearsData, parentsData] = await Promise.all([
          getClasses(),
          academicYearService.getAll(),
          userService.getAll(),
        ]);

        setClasses(classesData.map((c) => ({ id: c.id, name: c.name })));
        setAcademicYears(academicYearsData.map((ay) => ({ id: ay.id, name: ay.name })));
        
        const parentUsers = parentsData.filter((user) => {
          const normalizedRole = String(user.role ?? "").toUpperCase();
          return normalizedRole.includes("PARENT");
        });
        setParents(parentUsers);
      } catch (error) {
        toast.error("Failed to load required data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formData.classId) {
      const fetchSections = async () => {
        try {
          const sectionsData = await getSectionsByClassId(formData.classId);
          setSections(sectionsData.map((s) => ({ id: s.id, name: s.name })));
        } catch (error) {
          toast.error("Failed to load sections");
        }
      };

      fetchSections();
    } else {
      setSections([]);
    }
  }, [formData.classId]);

  const handleInputChange = (field: keyof StudentAdmissionData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const admissionNumber = `ADM-${year}-${random}`;
    handleInputChange("admissionNumber", admissionNumber);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    handleInputChange("password", password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Student name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    if (!formData.admissionNumber.trim()) {
      toast.error("Admission number is required");
      return;
    }

    if (!formData.dob) {
      toast.error("Date of birth is required");
      return;
    }

    if (!formData.parentId) {
      toast.error("Parent selection is required");
      return;
    }

    if (!formData.academicYearId) {
      toast.error("Academic year selection is required");
      return;
    }

    if (!formData.classId) {
      toast.error("Class selection is required");
      return;
    }

    if (!formData.sectionId) {
      toast.error("Section selection is required");
      return;
    }

    if (formData.rollNumber < 1) {
      toast.error("Roll number must be at least 1");
      return;
    }

    setIsSubmitting(true);

    // Debug: Log form data
    console.log("🔍 Student Admission Data:", formData);
    console.log("🔍 Student Service:", studentService);
    console.log("🔍 Available functions:", Object.keys(studentService));

    try {
      console.log("🚀 Calling admitStudent...");
      const result = await studentService.admitStudent(formData);
      console.log("✅ Admission successful:", result);
      toast.success("Student admitted successfully!");
      navigate("/admin/students");
    } catch (error) {
      console.error("❌ Admission Error:", error);
      console.error("❌ Error Type:", typeof error);
      console.error("❌ Error Message:", error instanceof Error ? error.message : "Unknown error");
      
      const errorMessage = error instanceof Error ? error.message : "Failed to admit student";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Student Admission</h1>
          <p className="text-muted-foreground">Admit a new student to the school</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter student's full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                    disabled={isSubmitting}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="admissionNumber">Admission Number *</Label>
                <div className="flex gap-2">
                  <Input
                    id="admissionNumber"
                    placeholder="e.g., ADM-2026-001"
                    value={formData.admissionNumber}
                    onChange={(e) => handleInputChange("admissionNumber", e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateAdmissionNumber}
                    disabled={isSubmitting}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "male" | "female" | "other") => handleInputChange("gender", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="parentId">Parent *</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => handleInputChange("parentId", value)}
                    disabled={isSubmitting || parents.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          parents.length === 0 ? "No parents available" : "Select parent"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} ({parent.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="academicYearId">Academic Year *</Label>
                  <Select
                    value={formData.academicYearId}
                    onValueChange={(value) => handleInputChange("academicYearId", value)}
                    disabled={isSubmitting || academicYears.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          academicYears.length === 0
                            ? "No academic years available"
                            : "Select academic year"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="classId">Class *</Label>
                  <Select
                    value={formData.classId}
                    onValueChange={(value) => {
                      handleInputChange("classId", value);
                      handleInputChange("sectionId", ""); // Reset section when class changes
                    }}
                    disabled={isSubmitting || classes.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          classes.length === 0 ? "No classes available" : "Select class"
                        }
                      />
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
                  <Label htmlFor="sectionId">Section *</Label>
                  <Select
                    value={formData.sectionId}
                    onValueChange={(value) => handleInputChange("sectionId", value)}
                    disabled={isSubmitting || sections.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          sections.length === 0 ? "No sections available" : "Select section"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-full md:w-1/4">
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  type="number"
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={(e) => handleInputChange("rollNumber", parseInt(e.target.value) || 1)}
                  disabled={isSubmitting}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/students")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Admitting Student...
                  </>
                ) : (
                  "Admit Student"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
