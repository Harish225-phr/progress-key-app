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
import {
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  TrendingUp,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Award,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  FileText,
  CreditCard,
  ChevronRight,
  User,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { parentService, type ChildDetail } from "@/services/parentService";

export default function Children() {
  const [children, setChildren] = useState<ChildDetail[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const childrenData = await parentService.getChildren();
        
        // Get detailed information for each child
        const detailedChildren = await Promise.all(
          childrenData.map(async (child) => {
            return await parentService.getChildDetail(child._id);
          })
        );
        
        setChildren(detailedChildren);
        if (detailedChildren.length > 0) {
          setSelectedChild(detailedChildren[0]);
        }
      } catch (error) {
        toast.error("Failed to load children data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, []);

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "late": return "bg-yellow-100 text-yellow-800";
      case "leave": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case "a+": case "a": return "bg-green-100 text-green-800";
      case "b+": case "b": return "bg-blue-100 text-blue-800";
      case "c+": case "c": return "bg-yellow-100 text-yellow-800";
      case "d": return "bg-orange-100 text-orange-800";
      case "f": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBehaviorColor = (type: string) => {
    switch (type) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading children data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Children</h1>
          <p className="text-muted-foreground">
            Manage and monitor your children's academic progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Reports
          </Button>
        </div>
      </div>

      {/* Children List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card 
            key={child._id} 
            className={`cursor-pointer transition-all ${
              selectedChild?._id === child._id ? "ring-2 ring-blue-500" : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedChild(child)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{child.firstName} {child.lastName}</CardTitle>
                <Badge variant="outline">{child.admissionNumber}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {child.classId.name} - {child.sectionId.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Roll No: {child.rollNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm">DOB: {child.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Status: {child.status}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Child Details */}
      {selectedChild && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {selectedChild.firstName} {selectedChild.lastName} - Detailed View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Attendance</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {selectedChild.attendanceHistory.length > 0 
                              ? Math.round((selectedChild.attendanceHistory.filter(a => a.status === "present").length / selectedChild.attendanceHistory.length) * 100)
                              : 0}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">Total Fees</p>
                          <p className="text-2xl font-bold text-green-800">
                            ₹{selectedChild.feeRecords.reduce((sum, fee) => sum + fee.amount, 0)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Award className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Exams</p>
                          <p className="text-2xl font-bold text-purple-800">
                            {selectedChild.examResults.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <Star className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Behavior</p>
                          <p className="text-2xl font-bold text-yellow-800">
                            {selectedChild.behaviorRecords.filter(b => b.type === "positive").length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Full Name:</span>
                          <span className="font-medium">{selectedChild.firstName} {selectedChild.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Date of Birth:</span>
                          <span className="font-medium">{selectedChild.dateOfBirth}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">Gender:</span>
                          <span className="font-medium capitalize">{selectedChild.gender}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Class:</span>
                          <span className="font-medium">{selectedChild.classId.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Section:</span>
                          <span className="font-medium">{selectedChild.sectionId.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">Roll Number:</span>
                          <span className="font-medium">{selectedChild.rollNumber}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marked By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedChild.attendanceHistory.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>
                              <Badge className={getAttendanceColor(record.status)}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.markedBy || "-"}</TableCell>
                          </TableRow>
                        ))}
                        {selectedChild.attendanceHistory.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                              No attendance records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fees" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fee Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fee Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Paid Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Method</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedChild.feeRecords.map((fee, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{fee.feeType}</TableCell>
                            <TableCell>₹{fee.amount}</TableCell>
                            <TableCell>{fee.dueDate}</TableCell>
                            <TableCell>{fee.paidDate || "-"}</TableCell>
                            <TableCell>
                              <Badge className={getFeeStatusColor(fee.status)}>
                                {fee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{fee.paymentMethod || "-"}</TableCell>
                          </TableRow>
                        ))}
                        {selectedChild.feeRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No fee records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                {selectedChild.examResults.map((exam, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{exam.examName}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{exam.date}</Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {exam.totalPercentage.toFixed(1)}%
                          </Badge>
                          {exam.rank && (
                            <Badge className="bg-green-100 text-green-800">
                              Rank #{exam.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Marks</TableHead>
                            <TableHead>Total Marks</TableHead>
                            <TableHead>Percentage</TableHead>
                            <TableHead>Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exam.subjects.map((subject, subjectIndex) => (
                            <TableRow key={subjectIndex}>
                              <TableCell className="font-medium">{subject.subjectName}</TableCell>
                              <TableCell>{subject.marks}</TableCell>
                              <TableCell>{subject.totalMarks}</TableCell>
                              <TableCell>{subject.percentage.toFixed(1)}%</TableCell>
                              <TableCell>
                                <Badge className={getGradeColor(subject.grade)}>
                                  {subject.grade}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
                {selectedChild.examResults.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No exam results found</p>
                      <p className="text-muted-foreground">
                        Exam results will appear here once available
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Behavior Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Recorded By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedChild.behaviorRecords.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>
                              <Badge className={getBehaviorColor(record.type)}>
                                {record.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell className={record.points > 0 ? "text-green-600" : "text-red-600"}>
                              {record.points > 0 ? "+" : ""}{record.points}
                            </TableCell>
                            <TableCell>{record.recordedBy}</TableCell>
                          </TableRow>
                        ))}
                        {selectedChild.behaviorRecords.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No behavior records found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
