import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  AlertCircle,
  Users,
  School,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Dummy data
const announcements = [
  {
    id: 1,
    title: "Annual Sports Day 2024",
    content: "We are excited to announce our Annual Sports Day on December 20, 2024. All students are required to participate. Practice sessions will begin from December 15. Parents are cordially invited to attend.",
    date: "Dec 12, 2024",
    isSchoolWide: true,
    category: "Event",
  },
  {
    id: 2,
    title: "Class Photo Session",
    content: "Class photos will be taken on December 18, 2024. Please wear proper school uniform. Students should come prepared and be present by 8:30 AM.",
    date: "Dec 11, 2024",
    isSchoolWide: false,
    category: "Notice",
  },
  {
    id: 3,
    title: "Winter Break Schedule",
    content: "Winter break will commence from December 25, 2024 to January 5, 2025. School will reopen on January 6, 2025. Holiday homework will be assigned.",
    date: "Dec 10, 2024",
    isSchoolWide: true,
    category: "Holiday",
  },
  {
    id: 4,
    title: "Science Exhibition",
    content: "Class 10 Science Exhibition will be held on December 22. Students should prepare their projects and submit the project outline by December 16.",
    date: "Dec 8, 2024",
    isSchoolWide: false,
    category: "Event",
  },
  {
    id: 5,
    title: "Parent-Teacher Meeting",
    content: "PTM for Class 10 will be conducted on January 10, 2025. Parents are requested to collect report cards and discuss student progress with class teachers.",
    date: "Dec 5, 2024",
    isSchoolWide: false,
    category: "Meeting",
  },
  {
    id: 6,
    title: "Fee Payment Reminder",
    content: "This is a reminder that Q3 fees are due by December 31, 2024. Please ensure timely payment to avoid late fees. Online payment is available through the school portal.",
    date: "Dec 1, 2024",
    isSchoolWide: true,
    category: "Finance",
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Event":
      return "bg-blue-500/10 text-blue-600";
    case "Notice":
      return "bg-yellow-500/10 text-yellow-600";
    case "Holiday":
      return "bg-green-500/10 text-green-600";
    case "Meeting":
      return "bg-purple-500/10 text-purple-600";
    case "Finance":
      return "bg-orange-500/10 text-orange-600";
    default:
      return "bg-gray-500/10 text-gray-600";
  }
};

const AnnouncementsPage = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "school" | "class">("all");

  const filteredAnnouncements = announcements.filter((a) => {
    if (filter === "school") return a.isSchoolWide;
    if (filter === "class") return !a.isSchoolWide;
    return true;
  });

  const schoolWideCount = announcements.filter((a) => a.isSchoolWide).length;
  const classCount = announcements.filter((a) => !a.isSchoolWide).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with school and class news</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all ${
            filter === "school" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter(filter === "school" ? "all" : "school")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <School className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{schoolWideCount}</p>
            <p className="text-xs text-muted-foreground">School-wide</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all ${
            filter === "class" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => setFilter(filter === "class" ? "all" : "class")}
        >
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">{classCount}</p>
            <p className="text-xs text-muted-foreground">Class Specific</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "school" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("school")}
        >
          School-wide
        </Button>
        <Button
          variant={filter === "class" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("class")}
        >
          Class Only
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card
            key={announcement.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() =>
              setExpandedId(expandedId === announcement.id ? null : announcement.id)
            }
          >
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {announcement.isSchoolWide ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <School className="h-3 w-3" />
                        School
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Class 10-A
                      </Badge>
                    )}
                    <Badge className={getCategoryColor(announcement.category)}>
                      {announcement.category}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {announcement.title}
                  </h3>
                  <p
                    className={`text-sm text-muted-foreground ${
                      expandedId === announcement.id ? "" : "line-clamp-2"
                    }`}
                  >
                    {announcement.content}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{announcement.date}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  {expandedId === announcement.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
