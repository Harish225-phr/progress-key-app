import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookMarked,
  Calendar,
  User,
  BookOpen,
  Clock,
} from "lucide-react";

// Dummy data
const dailyTopics = [
  {
    id: 1,
    date: "Dec 14, 2024",
    subject: "Mathematics",
    chapter: "Chapter 5 - Algebra",
    topic: "Solving Quadratic Equations",
    description: "Learned the quadratic formula and how to apply it to solve equations. Practiced with 10 example problems.",
    teacher: "Mr. Sharma",
    classSection: "Class 10 - Section A",
  },
  {
    id: 2,
    date: "Dec 14, 2024",
    subject: "Science",
    chapter: "Chapter 7 - Forces and Motion",
    topic: "Newton's Third Law",
    description: "Understanding action and reaction forces with practical examples. Demonstrated with balloon experiment.",
    teacher: "Mrs. Gupta",
    classSection: "Class 10 - Section A",
  },
  {
    id: 3,
    date: "Dec 14, 2024",
    subject: "English",
    chapter: "Poetry - Unit 4",
    topic: "Shakespearean Sonnets",
    description: "Analyzed the structure and themes of Shakespeare's Sonnet 18. Discussed rhyme scheme and meter.",
    teacher: "Mr. Khan",
    classSection: "Class 10 - Section A",
  },
  {
    id: 4,
    date: "Dec 13, 2024",
    subject: "History",
    chapter: "Chapter 12 - World Wars",
    topic: "Causes of World War II",
    description: "Discussed the Treaty of Versailles and its impact. Covered the rise of fascism in Europe.",
    teacher: "Ms. Reddy",
    classSection: "Class 10 - Section A",
  },
  {
    id: 5,
    date: "Dec 13, 2024",
    subject: "Mathematics",
    chapter: "Chapter 5 - Algebra",
    topic: "Introduction to Quadratic Equations",
    description: "Learned what quadratic equations are and how to identify them. Introduction to standard form.",
    teacher: "Mr. Sharma",
    classSection: "Class 10 - Section A",
  },
  {
    id: 6,
    date: "Dec 12, 2024",
    subject: "Science",
    chapter: "Chapter 7 - Forces and Motion",
    topic: "Newton's Second Law",
    description: "F = ma formula explained with real-world examples. Calculated force for various scenarios.",
    teacher: "Mrs. Gupta",
    classSection: "Class 10 - Section A",
  },
];

const getSubjectColor = (subject: string) => {
  switch (subject) {
    case "Mathematics":
      return "bg-blue-500/10 text-blue-600 border-blue-200";
    case "Science":
      return "bg-green-500/10 text-green-600 border-green-200";
    case "English":
      return "bg-purple-500/10 text-purple-600 border-purple-200";
    case "History":
      return "bg-orange-500/10 text-orange-600 border-orange-200";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
};

const DailyTopicsPage = () => {
  // Group topics by date
  const groupedTopics = dailyTopics.reduce((acc, topic) => {
    if (!acc[topic.date]) {
      acc[topic.date] = [];
    }
    acc[topic.date].push(topic);
    return acc;
  }, {} as Record<string, typeof dailyTopics>);

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Daily Topics</h1>
        <p className="text-muted-foreground">What was taught in class each day</p>
      </div>

      {/* Today's Topics Highlight */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Today's Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dailyTopics
              .filter((t) => t.date === "Dec 14, 2024")
              .map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 rounded-lg border ${getSubjectColor(topic.subject)}`}
                >
                  <Badge variant="outline" className="mb-2">
                    {topic.subject}
                  </Badge>
                  <h4 className="font-semibold text-foreground">{topic.topic}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{topic.chapter}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* All Topics by Date */}
      {Object.entries(groupedTopics).map(([date, topics]) => (
        <Card key={date}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              {date}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={getSubjectColor(topic.subject)}
                      >
                        {topic.subject}
                      </Badge>
                      <Badge variant="secondary">{topic.chapter}</Badge>
                    </div>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BookMarked className="h-4 w-4 text-primary" />
                    {topic.topic}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{topic.teacher}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{topic.classSection}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailyTopicsPage;
