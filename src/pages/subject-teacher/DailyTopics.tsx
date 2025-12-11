import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookOpen, Plus, Eye, Calendar } from "lucide-react";

const mockTopics = [
  { id: 1, chapter: "Chapter 3", topic: "Quadratic Equations - Introduction", date: "2024-03-15", teacher: "Mr. Smith", class: "10th", section: "A", description: "Introduced the concept of quadratic equations. Covered standard form ax² + bx + c = 0. Discussed real-world applications and examples." },
  { id: 2, chapter: "Chapter 3", topic: "Solving Quadratic by Factoring", date: "2024-03-14", teacher: "Mr. Smith", class: "10th", section: "A", description: "Taught factoring method for solving quadratic equations. Practiced with multiple examples. Students solved 5 problems in class." },
  { id: 3, chapter: "Chapter 2", topic: "Linear Equations Revision", date: "2024-03-13", teacher: "Mr. Smith", class: "10th", section: "B", description: "Revision class for linear equations. Covered graphical representation. Doubt clearing session." },
  { id: 4, chapter: "Chapter 5", topic: "Triangles - Properties", date: "2024-03-12", teacher: "Mr. Smith", class: "9th", section: "A", description: "Discussed properties of triangles. Covered angle sum property and exterior angle theorem. Students drew diagrams." },
];

const classes = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];

export default function DailyTopicsPage() {
  const [topics, setTopics] = useState(mockTopics);
  const [selectedTopic, setSelectedTopic] = useState<typeof mockTopics[0] | null>(null);
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    subject: "Mathematics",
    chapter: "",
    topic: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class || !formData.section || !formData.chapter || !formData.topic) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTopic = {
      id: topics.length + 1,
      chapter: formData.chapter,
      topic: formData.topic,
      date: new Date().toISOString().split("T")[0],
      teacher: "Mr. Smith",
      class: formData.class,
      section: formData.section,
      description: formData.description,
    };

    setTopics([newTopic, ...topics]);
    toast.success("Daily topic recorded successfully!");
    setFormData({
      class: "",
      section: "",
      subject: "Mathematics",
      chapter: "",
      topic: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daily Topics</h1>
        <p className="text-muted-foreground">"Aaj kya padhaaya" - Record what you taught today</p>
      </div>

      {/* Add Topic Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Record Today's Topic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Select Class *</Label>
                <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Section *</Label>
                <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject (Auto-filled)</Label>
                <Input value={formData.subject} readOnly className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label>Chapter *</Label>
                <Select value={formData.chapter} onValueChange={(v) => setFormData({ ...formData, chapter: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="topic">Today's Topic *</Label>
                <Input
                  id="topic"
                  placeholder="Enter the topic you taught today"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Summary of what was taught)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what was covered in today's class..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <Button type="submit">
              <BookOpen className="h-4 w-4 mr-2" />
              Save Topic
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Topics List */}
      <Card>
        <CardHeader>
          <CardTitle>Topics History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chapter</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Class / Section</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.chapter}</TableCell>
                  <TableCell>{topic.topic}</TableCell>
                  <TableCell>{topic.class} - {topic.section}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {topic.date}
                    </div>
                  </TableCell>
                  <TableCell>{topic.teacher}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Topic Details</DialogTitle>
          </DialogHeader>
          {selectedTopic && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Chapter</p>
                  <p className="font-medium">{selectedTopic.chapter}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class / Section</p>
                  <p className="font-medium">{selectedTopic.class} - {selectedTopic.section}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedTopic.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teacher</p>
                  <p className="font-medium">{selectedTopic.teacher}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topic</p>
                <p className="font-semibold text-lg">{selectedTopic.topic}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground bg-muted p-3 rounded-md">{selectedTopic.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
