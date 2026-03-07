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

console.log("🚀 StudentAdmission component loading...");

export default function StudentAdmission() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: Check studentService on component mount
  console.log("🔍 Component mounted - studentService:", studentService);
  console.log("🔍 Component mounted - admitStudent:", studentService?.admitStudent);
  console.log("🔍 Component mounted - typeof:", typeof studentService?.admitStudent);

  const [formData, setFormData] = useState<StudentAdmissionData>({
    firstName: "",
    lastName: "",
    admissionNumber: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    password: "",
    academicYearId: "",
    classId: "",
    sectionId: "",
    rollNumber: 1,
    parentUserId: "",
    address: "",
    bloodGroup: "",
  });

  const [admissionMode, setAdmissionMode] = useState<"quick" | "full">("quick");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, academicYearsData, parentsData] = await Promise.all([
          getClasses(),
          academicYearService.getList(),
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

    // Basic validation for quick mode
    if (!formData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!formData.admissionNumber.trim()) {
      toast.error("Admission number is required");
      return;
    }

    if (!formData.dateOfBirth) {
      toast.error("Date of birth is required");
      return;
    }

    if (!formData.gender) {
      toast.error("Gender is required");
      return;
    }

    // Full mode validation
    if (admissionMode === "full") {
      if (!formData.academicYearId) {
        toast.error("Academic year is required for full admission");
        return;
      }

      if (!formData.classId) {
        toast.error("Class is required for full admission");
        return;
      }

      if (!formData.sectionId) {
        toast.error("Section is required for full admission");
        return;
      }

      if (formData.rollNumber < 1) {
        toast.error("Roll number must be at least 1");
        return;
      }
    }

    setIsSubmitting(true);

    // Debug: Log form data
    console.log("🔍 Student Admission Data:", formData);
    console.log("🔍 Student Service:", studentService);
    console.log("🔍 Available functions:", Object.keys(studentService));
    console.log("🔍 admitStudent function:", studentService?.admitStudent);
    console.log("🔍 admitStudent type:", typeof studentService?.admitStudent);

    try {
      console.log("🚀 Calling admitStudent...");
      console.log("🚀 Function exists:", typeof studentService.admitStudent === 'function');
      const result = await studentService.admitStudent(formData);
      console.log("✅ Admission successful:", result);
      
      const message = admissionMode === "quick" 
        ? "Student admitted successfully! Assign class later." 
        : "Student admitted and enrolled successfully!";
      
      toast.success(message);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Admission</h1>
          <p className="text-muted-foreground">
            {admissionMode === "quick" 
              ? "Quick admission with basic information" 
              : "Complete admission with class assignment"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={admissionMode === "quick" ? "default" : "outline"}
            onClick={() => setAdmissionMode("quick")}
          >
            Quick Admission
          </Button>
          <Button
            variant={admissionMode === "full" ? "default" : "outline"}
            onClick={() => setAdmissionMode("full")}
          >
            Full Admission
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {admissionMode === "quick" ? "Basic Information" : "Complete Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields - Always Show */}
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Enter student's first name"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Enter student's last name"
                required
              />
            </div>

            <div>
              <Label htmlFor="admissionNumber">Admission Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="admissionNumber"
                  value={formData.admissionNumber}
                  onChange={(e) => handleInputChange("admissionNumber", e.target.value)}
                  placeholder="Auto-generated or enter manually"
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
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: "Male" | "Female" | "Other") => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Optional Fields - Always Available */}
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="student@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password (Optional - Auto-generated)</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Leave blank to auto-generate"
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
              <Label htmlFor="address">Address (Optional)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter address"
              />
            </div>

            <div>
              <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Full Admission Mode - Additional Fields */}
          {admissionMode === "full" && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold">Academic Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={formData.academicYearId}
                    onValueChange={(value) => handleInputChange("academicYearId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
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
                  <Label htmlFor="class">Class</Label>
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
                  <Label htmlFor="section">Section</Label>
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

                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    type="number"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange("rollNumber", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="parentUserId">Parent (Optional)</Label>
                  <Select
                    value={formData.parentUserId}
                    onValueChange={(value) => handleInputChange("parentUserId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.name} - {parent.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

            <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {admissionMode === "quick" ? "Quick Admitting..." : "Admitting..."}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {admissionMode === "quick" ? "Quick Admit Student" : "Admit Student"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/students")}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
