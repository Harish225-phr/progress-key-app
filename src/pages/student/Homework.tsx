import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Calendar,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  FileImage,
  File,
} from "lucide-react";

// Dummy data
const homeworkList = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Algebra Practice Set 5",
    description: "Complete exercises 1-20 from Chapter 5. Show all working steps.",
    dueDate: "Dec 14, 2024",
    assignedDate: "Dec 10, 2024",
    status: "pending",
    attachments: [{ name: "algebra_worksheet.pdf", type: "pdf" }],
  },
  {
    id: 2,
    subject: "Science",
    title: "Chapter 7 Questions",
    description: "Answer all questions from the end of Chapter 7 - Forces and Motion.",
    dueDate: "Dec 15, 2024",
    assignedDate: "Dec 11, 2024",
    status: "pending",
    attachments: [],
  },
  {
    id: 3,
    subject: "English",
    title: "Essay Writing - My Favorite Book",
    description: "Write a 500-word essay about your favorite book and why you recommend it.",
    dueDate: "Dec 13, 2024",
    assignedDate: "Dec 9, 2024",
    status: "completed",
    attachments: [{ name: "essay_guidelines.docx", type: "doc" }],
  },
  {
    id: 4,
    subject: "History",
    title: "World War II Research",
    description: "Research and prepare notes on the causes and effects of World War II.",
    dueDate: "Dec 18, 2024",
    assignedDate: "Dec 12, 2024",
    status: "pending",
    attachments: [
      { name: "research_template.pdf", type: "pdf" },
      { name: "reference_images.zip", type: "zip" },
    ],
  },
  {
    id: 5,
    subject: "Mathematics",
    title: "Geometry Basics",
    description: "Complete the geometry problems worksheet with diagrams.",
    dueDate: "Dec 10, 2024",
    assignedDate: "Dec 5, 2024",
    status: "completed",
    attachments: [{ name: "geometry_sheet.pdf", type: "pdf" }],
  },
];

const subjects = ["All Subjects", "Mathematics", "Science", "English", "History"];

const HomeworkPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [statusFilter, setStatusFilter] = useState("all");
  const [localHomework, setLocalHomework] = useState(homeworkList);

  const filteredHomework = localHomework.filter((hw) => {
    const matchesSearch =
      hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hw.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" || hw.subject === selectedSubject;
    const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  const toggleStatus = (id: number) => {
    setLocalHomework((prev) =>
      prev.map((hw) =>
        hw.id === id
          ? { ...hw, status: hw.status === "pending" ? "completed" : "pending" }
          : hw
      )
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "zip":
        return <File className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileImage className="h-4 w-4 text-green-500" />;
    }
  };

  const pendingCount = localHomework.filter((hw) => hw.status === "pending").length;
  const completedCount = localHomework.filter((hw) => hw.status === "completed").length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Homework</h1>
        <p className="text-muted-foreground">View and track your assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search homework..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomework.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No homework found</p>
            </CardContent>
          </Card>
        ) : (
          filteredHomework.map((hw) => (
            <Card
              key={hw.id}
              className={`transition-all ${
                hw.status === "completed" ? "opacity-75" : ""
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline">{hw.subject}</Badge>
                      <Badge
                        variant={hw.status === "completed" ? "secondary" : "destructive"}
                      >
                        {hw.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{hw.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{hw.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Assigned: {hw.assignedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due: {hw.dueDate}</span>
                      </div>
                    </div>
                    {hw.attachments.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {hw.attachments.map((file, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                          >
                            {getFileIcon(file.type)}
                            <span className="ml-1">{file.name}</span>
                            <Download className="h-3 w-3 ml-2" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant={hw.status === "completed" ? "secondary" : "default"}
                    size="sm"
                    onClick={() => toggleStatus(hw.id)}
                  >
                    {hw.status === "completed" ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Done
                      </>
                    ) : (
                      "Mark Complete"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeworkPage;
