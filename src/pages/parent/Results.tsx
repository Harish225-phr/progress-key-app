import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  Target,
  Star,
  Calendar,
  Users,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { parentService } from "@/services/parentService";

interface ExamResult {
  examName: string;
  date: string;
  subjects: Array<{
    subjectName: string;
    marks: number;
    totalMarks: number;
    grade: string;
    percentage: number;
  }>;
  totalPercentage: number;
  rank?: number;
}

export default function ParentResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const childrenData = await parentService.getChildren();
        setChildren(childrenData);
        
        if (childrenData.length > 0) {
          setSelectedChild(childrenData[0]._id);
        }
      } catch (error) {
        toast.error("Failed to load children");
        console.error(error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      loadResults();
    }
  }, [selectedChild]);

  const loadResults = async () => {
    if (!selectedChild) return;

    setLoading(true);
    try {
      const resultsData = await parentService.getChildResults(selectedChild);
      setResults(resultsData);
    } catch (error) {
      toast.error("Failed to load results");
      console.error(error);
    } finally {
      setLoading(false);
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

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const calculateOverallStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, totalExams: 0 };
    
    const percentages = results.map(r => r.totalPercentage);
    const average = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    const highest = Math.max(...percentages);
    const lowest = Math.min(...percentages);
    
    return { average, highest, lowest, totalExams: results.length };
  };

  const stats = calculateOverallStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exam Results</h1>
          <p className="text-muted-foreground">
            View and track your children's academic performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Child Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Child
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Select child to view results" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child._id} value={child._id}>
                  {child.firstName} {child.lastName} - {child.admissionNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Performance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Average Score</p>
                <p className="text-2xl font-bold text-blue-800">{stats.average.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Highest Score</p>
                <p className="text-2xl font-bold text-green-800">{stats.highest.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">Lowest Score</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.lowest.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Exams</p>
                <p className="text-2xl font-bold text-purple-800">{stats.totalExams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {results.map((exam, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {exam.examName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exam.date}
                  </Badge>
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
                    <TableHead>Performance</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {subject.percentage >= 75 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : subject.percentage >= 60 ? (
                            <Target className="h-4 w-4 text-yellow-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${getPerformanceColor(subject.percentage)}`}>
                            {subject.percentage >= 75 ? "Excellent" : subject.percentage >= 60 ? "Good" : "Needs Improvement"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
        {results.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No exam results found</p>
              <p className="text-muted-foreground">
                Results will appear here once exams are conducted and graded
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
