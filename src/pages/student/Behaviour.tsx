import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Award,
  Calendar,
  User,
} from "lucide-react";

// Dummy data
const behaviourNotes = [
  {
    id: 1,
    date: "Dec 12, 2024",
    teacher: "Mr. Sharma",
    subject: "Mathematics",
    tag: "Excellent",
    description: "Outstanding participation in today's problem-solving session. Helped other students understand concepts.",
  },
  {
    id: 2,
    date: "Dec 10, 2024",
    teacher: "Mrs. Gupta",
    subject: "Science",
    tag: "Good",
    description: "Showed good effort in the lab experiment. Maintained proper safety protocols.",
  },
  {
    id: 3,
    date: "Dec 8, 2024",
    teacher: "Mr. Khan",
    subject: "English",
    tag: "Needs Improvement",
    description: "Was distracted during class discussion. Please focus more on the lesson.",
  },
  {
    id: 4,
    date: "Dec 5, 2024",
    teacher: "Ms. Reddy",
    subject: "History",
    tag: "Good",
    description: "Submitted excellent research work on World War II. Well organized presentation.",
  },
  {
    id: 5,
    date: "Dec 3, 2024",
    teacher: "Mr. Sharma",
    subject: "Mathematics",
    tag: "Excellent",
    description: "Scored highest in the weekly test. Keep up the great work!",
  },
  {
    id: 6,
    date: "Nov 30, 2024",
    teacher: "Mrs. Gupta",
    subject: "Science",
    tag: "Average",
    description: "Completed the assignment on time but needs to pay more attention to details.",
  },
];

const getBadgeVariant = (tag: string) => {
  switch (tag) {
    case "Excellent":
      return "default";
    case "Good":
      return "secondary";
    case "Average":
      return "outline";
    case "Needs Improvement":
      return "destructive";
    case "Discipline Issue":
      return "destructive";
    default:
      return "outline";
  }
};

const getTagIcon = (tag: string) => {
  switch (tag) {
    case "Excellent":
      return <Award className="h-4 w-4" />;
    case "Good":
      return <ThumbsUp className="h-4 w-4" />;
    case "Average":
      return <MessageSquare className="h-4 w-4" />;
    case "Needs Improvement":
      return <AlertTriangle className="h-4 w-4" />;
    case "Discipline Issue":
      return <ThumbsDown className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const BehaviourPage = () => {
  const excellentCount = behaviourNotes.filter((n) => n.tag === "Excellent").length;
  const goodCount = behaviourNotes.filter((n) => n.tag === "Good").length;
  const averageCount = behaviourNotes.filter((n) => n.tag === "Average").length;
  const needsImprovementCount = behaviourNotes.filter(
    (n) => n.tag === "Needs Improvement" || n.tag === "Discipline Issue"
  ).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Behaviour Notes</h1>
        <p className="text-muted-foreground">View your behaviour remarks from teachers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{excellentCount}</p>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{goodCount}</p>
            <p className="text-xs text-muted-foreground">Good</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{averageCount}</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-orange-600">{needsImprovementCount}</p>
            <p className="text-xs text-muted-foreground">Needs Improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Behaviour Notes List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Behaviour Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {behaviourNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-muted/50 rounded-lg border-l-4"
                style={{
                  borderLeftColor:
                    note.tag === "Excellent"
                      ? "hsl(47.9 95.8% 53.1%)"
                      : note.tag === "Good"
                      ? "hsl(142.1 76.2% 36.3%)"
                      : note.tag === "Needs Improvement" ||
                        note.tag === "Discipline Issue"
                      ? "hsl(0 84.2% 60.2%)"
                      : "hsl(217.2 32.6% 17.5%)",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(note.tag)} className="flex items-center gap-1">
                      {getTagIcon(note.tag)}
                      {note.tag}
                    </Badge>
                    <Badge variant="outline">{note.subject}</Badge>
                  </div>
                </div>
                <p className="text-foreground mb-3">{note.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{note.teacher}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{note.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviourPage;
