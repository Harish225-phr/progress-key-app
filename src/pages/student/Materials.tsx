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
  BookOpen,
  FileText,
  FileImage,
  Video,
  File,
  Download,
  Search,
  ExternalLink,
  Presentation,
} from "lucide-react";

// Dummy data
const materialsList = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    chapter: "Chapter 5 - Algebra",
    description: "Complete guide to algebraic expressions and equations",
    fileType: "pdf",
    uploadedAt: "Dec 10, 2024",
    teacher: "Mr. Sharma",
    fileUrl: "#",
    videoLink: null,
  },
  {
    id: 2,
    title: "Newton's Laws of Motion",
    subject: "Science",
    chapter: "Chapter 7 - Forces",
    description: "Detailed explanation of all three laws with examples",
    fileType: "ppt",
    uploadedAt: "Dec 9, 2024",
    teacher: "Mrs. Gupta",
    fileUrl: "#",
    videoLink: "https://youtube.com/watch?v=example",
  },
  {
    id: 3,
    title: "Grammar Reference Guide",
    subject: "English",
    chapter: "Grammar Basics",
    description: "Complete grammar rules and usage guide",
    fileType: "pdf",
    uploadedAt: "Dec 8, 2024",
    teacher: "Mr. Khan",
    fileUrl: "#",
    videoLink: null,
  },
  {
    id: 4,
    title: "World War II Timeline",
    subject: "History",
    chapter: "Chapter 12 - Modern History",
    description: "Interactive timeline with key events and dates",
    fileType: "image",
    uploadedAt: "Dec 7, 2024",
    teacher: "Ms. Reddy",
    fileUrl: "#",
    videoLink: null,
  },
  {
    id: 5,
    title: "Geometry Formulas",
    subject: "Mathematics",
    chapter: "Chapter 6 - Geometry",
    description: "All important formulas with visual diagrams",
    fileType: "pdf",
    uploadedAt: "Dec 6, 2024",
    teacher: "Mr. Sharma",
    fileUrl: "#",
    videoLink: "https://youtube.com/watch?v=geometry",
  },
  {
    id: 6,
    title: "Chemical Reactions Lab Video",
    subject: "Science",
    chapter: "Chapter 4 - Chemistry",
    description: "Video demonstration of chemical reactions",
    fileType: "video",
    uploadedAt: "Dec 5, 2024",
    teacher: "Mrs. Gupta",
    fileUrl: null,
    videoLink: "https://youtube.com/watch?v=chemistry",
  },
];

const subjects = ["All Subjects", "Mathematics", "Science", "English", "History"];

const MaterialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");

  const filteredMaterials = materialsList.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "All Subjects" || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />;
      case "ppt":
        return <Presentation className="h-10 w-10 text-orange-500" />;
      case "image":
        return <FileImage className="h-10 w-10 text-green-500" />;
      case "video":
        return <Video className="h-10 w-10 text-blue-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case "pdf":
        return "PDF Document";
      case "ppt":
        return "Presentation";
      case "image":
        return "Image";
      case "video":
        return "Video";
      default:
        return "File";
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Study Materials</h1>
        <p className="text-muted-foreground">Access all your learning resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="h-6 w-6 mx-auto text-red-500 mb-2" />
            <p className="text-lg font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">PDFs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Presentation className="h-6 w-6 mx-auto text-orange-500 mb-2" />
            <p className="text-lg font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground">PPTs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <FileImage className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <p className="text-lg font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground">Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Video className="h-6 w-6 mx-auto text-blue-500 mb-2" />
            <p className="text-lg font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground">Videos</p>
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
                placeholder="Search materials..."
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
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No materials found</p>
            </CardContent>
          </Card>
        ) : (
          filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-16 w-16 bg-muted/50 rounded-lg flex items-center justify-center">
                    {getFileIcon(material.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {material.subject}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(material.fileType)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground truncate">
                      {material.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      {material.chapter}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground">
                        By {material.teacher} • {material.uploadedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {material.fileUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {material.videoLink && (
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Watch Video
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MaterialsPage;
