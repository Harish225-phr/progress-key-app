import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Plus, Loader2, UserCheck, CheckCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import { 
  studentService, 
  type PartialStudent, 
  type PartialAdmissionData, 
  type CompleteAdmissionData 
} from "@/services/studentService";
import { getClasses } from "@/services/classService";
import { getSectionsByClassId } from "@/services/classService";

export default function PartialAdmissions() {
  const [partialStudents, setPartialStudents] = useState<PartialStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "partial" | "completed">("all");
  const [selectedStudent, setSelectedStudent] = useState<PartialStudent | null>(null);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [sections, setSections] = useState<{ id: string; name: string }[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  // Partial admission form state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partialFormData, setPartialFormData] = useState<PartialAdmissionData>({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
  });
  const [editFormData, setEditFormData] = useState<PartialAdmissionData>({
    firstName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: "",
  });
  const [completeFormData, setCompleteFormData] = useState<CompleteAdmissionData>({
    classId: "",
    sectionId: "",
    parentUserId: "",
    rollNumber: 0,
    bloodGroup: "",
    admissionNumber: "",
  });

  useEffect(() => {
    fetchPartialAdmissions();
    fetchClasses();
  }, [statusFilter, searchTerm, pagination.page]);

  const fetchPartialAdmissions = async () => {
    try {
      setLoading(true);
      console.log("Fetching partial admissions with filters:", { statusFilter, searchTerm, page: pagination.page, limit: pagination.limit });
      
      const response = await studentService.getPartialAdmissions({
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchTerm || undefined,
        page: pagination.page,
        limit: pagination.limit,
      });
      
      console.log("API response:", response);
      
      setPartialStudents(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error("Failed to fetch partial admissions:", error);
      toast.error("Failed to fetch partial admissions");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const classesData = await getClasses();
      setClasses(classesData);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchSections = async (classId: string) => {
    try {
      const sectionsData = await getSectionsByClassId(classId);
      setSections(sectionsData);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  };

  const handlePartialAdmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partialFormData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!partialFormData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!partialFormData.dateOfBirth) {
      toast.error("Date of birth is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newPartialStudent = await studentService.createPartialAdmission(partialFormData);
      setPartialStudents(prev => [newPartialStudent, ...prev]);
      toast.success("Partial admission created successfully!");
      setAddDialogOpen(false);
      setPartialFormData({
        firstName: "",
        lastName: "",
        gender: "Male",
        dateOfBirth: "",
        email: "",
        phone: "",
        address: "",
        emergencyContact: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create partial admission";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteAdmission = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) return;

    if (!completeFormData.classId) {
      toast.error("Class selection is required");
      return;
    }
    if (!completeFormData.sectionId) {
      toast.error("Section selection is required");
      return;
    }
    if (!completeFormData.parentUserId) {
      toast.error("Parent selection is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await studentService.completeAdmission(selectedStudent._id, completeFormData);
      toast.success("Admission completed successfully!");
      setCompleteDialogOpen(false);
      setSelectedStudent(null);
      fetchPartialAdmissions(); // Refresh list
      setCompleteFormData({
        classId: "",
        sectionId: "",
        parentUserId: "",
        rollNumber: 0,
        bloodGroup: "",
        admissionNumber: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete admission";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (student: PartialStudent) => {
    setSelectedStudent(student);
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
      emergencyContact: student.emergencyContact || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) return;

    if (!editFormData.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    if (!editFormData.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }
    if (!editFormData.dateOfBirth) {
      toast.error("Date of birth is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await studentService.updatePartialStudent(selectedStudent._id, editFormData);
      toast.success("Student information updated successfully!");
      setEditDialogOpen(false);
      setSelectedStudent(null);
      fetchPartialAdmissions(); // Refresh list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update student";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCompleteDialog = (student: PartialStudent) => {
    setSelectedStudent(student);
    setCompleteFormData({
      classId: "",
      sectionId: "",
      parentUserId: "",
      rollNumber: 0,
      bloodGroup: "",
      admissionNumber: `ADM-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    });
    setCompleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "partial":
        return <Badge variant="secondary">Partial</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredStudents = partialStudents.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Partial Admissions</h1>
          <p className="text-muted-foreground">Manage partial and complete student admissions</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Partial Admission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Partial Admission</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Add basic student information. Complete admission can be done later.
              </p>
            </DialogHeader>
            <form onSubmit={handlePartialAdmission} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={partialFormData.firstName}
                    onChange={(e) => setPartialFormData({ ...partialFormData, firstName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={partialFormData.lastName}
                    onChange={(e) => setPartialFormData({ ...partialFormData, lastName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={partialFormData.gender}
                    onValueChange={(value) => setPartialFormData({ ...partialFormData, gender: value as "Male" | "Female" | "Other" })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={partialFormData.dateOfBirth}
                    onChange={(e) => setPartialFormData({ ...partialFormData, dateOfBirth: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={partialFormData.email}
                    onChange={(e) => setPartialFormData({ ...partialFormData, email: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={partialFormData.phone}
                    onChange={(e) => setPartialFormData({ ...partialFormData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Full address"
                  value={partialFormData.address}
                  onChange={(e) => setPartialFormData({ ...partialFormData, address: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Emergency contact number"
                  value={partialFormData.emergencyContact}
                  onChange={(e) => setPartialFormData({ ...partialFormData, emergencyContact: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Partial Admission...
                  </>
                ) : (
                  "Create Partial Admission"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partial Admissions List</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="partial">Partial Only</SelectItem>
                <SelectItem value="completed">Completed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No partial admissions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString()}</TableCell>
                    <TableCell>{student.email || "-"}</TableCell>
                    <TableCell>{student.phone || "-"}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(student)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {student.status === "partial" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCompleteDialog(student)}
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Update student basic information
            </p>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name *</Label>
                  <Input
                    id="editFirstName"
                    placeholder="First name"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name *</Label>
                  <Input
                    id="editLastName"
                    placeholder="Last name"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editGender">Gender *</Label>
                  <Select
                    value={editFormData.gender}
                    onValueChange={(value) => setEditFormData({ ...editFormData, gender: value as "Male" | "Female" | "Other" })}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="editGender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editDateOfBirth">Date of Birth *</Label>
                  <Input
                    id="editDateOfBirth"
                    type="date"
                    value={editFormData.dateOfBirth}
                    onChange={(e) => setEditFormData({ ...editFormData, dateOfBirth: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    placeholder="Email address"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input
                    id="editPhone"
                    placeholder="Phone number"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editAddress">Address</Label>
                <Input
                  id="editAddress"
                  placeholder="Full address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="editEmergencyContact">Emergency Contact</Label>
                <Input
                  id="editEmergencyContact"
                  placeholder="Emergency contact number"
                  value={editFormData.emergencyContact}
                  onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Update Student
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Student Details Dialog */}
      <Dialog open={!!selectedStudent && !completeDialogOpen} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <p className="text-sm text-muted-foreground">
              View and manage student information
            </p>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="font-medium">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="font-medium">{selectedStudent.gender}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p className="font-medium">{new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedStudent.status)}
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{selectedStudent.email || "Not provided"}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">{selectedStudent.phone || "Not provided"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p className="font-medium">{selectedStudent.address || "Not provided"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Emergency Contact</Label>
                    <p className="font-medium">{selectedStudent.emergencyContact || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                {selectedStudent.status === "partial" && (
                  <Button onClick={() => openCompleteDialog(selectedStudent)}>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Complete Admission
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Admission Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Admission</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Complete admission for: <strong>{selectedStudent?.firstName} {selectedStudent?.lastName}</strong>
            </p>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedStudent.firstName} {selectedStudent.lastName}</div>
                  <div><span className="font-medium">Gender:</span> {selectedStudent.gender}</div>
                  <div><span className="font-medium">DOB:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</div>
                  <div><span className="font-medium">Email:</span> {selectedStudent.email || "Not provided"}</div>
                </div>
              </div>

              {/* Complete Admission Form */}
              <form onSubmit={handleCompleteAdmission} className="space-y-4">
                <h4 className="font-semibold">Academic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classId">Class *</Label>
                <Select
                  value={completeFormData.classId}
                  onValueChange={(value) => {
                    setCompleteFormData({ ...completeFormData, classId: value });
                    fetchSections(value);
                  }}
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
                <Label htmlFor="sectionId">Section *</Label>
                <Select
                  value={completeFormData.sectionId}
                  onValueChange={(value) => setCompleteFormData({ ...completeFormData, sectionId: value })}
                  disabled={isSubmitting || sections.length === 0}
                >
                  <SelectTrigger id="sectionId">
                    <SelectValue placeholder="Select section" />
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentUserId">Parent User ID *</Label>
                <Input
                  id="parentUserId"
                  placeholder="Parent user ID"
                  value={completeFormData.parentUserId}
                  onChange={(e) => setCompleteFormData({ ...completeFormData, parentUserId: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  type="number"
                  placeholder="Roll number"
                  value={completeFormData.rollNumber}
                  onChange={(e) => setCompleteFormData({ ...completeFormData, rollNumber: parseInt(e.target.value) || 0 })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  placeholder="e.g., B+"
                  value={completeFormData.bloodGroup}
                  onChange={(e) => setCompleteFormData({ ...completeFormData, bloodGroup: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="admissionNumber">Admission Number *</Label>
                <Input
                  id="admissionNumber"
                  placeholder="Admission number"
                  value={completeFormData.admissionNumber}
                  onChange={(e) => setCompleteFormData({ ...completeFormData, admissionNumber: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Completing Admission...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Admission
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
