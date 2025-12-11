import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquare, Send, Star, AlertTriangle, CheckCircle, User } from "lucide-react";

const mockStudents = [
  { id: 1, name: "John Smith", class: "10th", section: "A", roll: "101" },
  { id: 2, name: "Emma Johnson", class: "10th", section: "A", roll: "102" },
  { id: 3, name: "Michael Brown", class: "10th", section: "B", roll: "103" },
  { id: 4, name: "Sarah Davis", class: "9th", section: "A", roll: "104" },
  { id: 5, name: "James Wilson", class: "9th", section: "B", roll: "105" },
];

const mockBehaviourNotes = [
  { id: 1, studentName: "John Smith", date: "2024-03-15", tag: "Excellent", remarks: "Outstanding participation in class discussion", teacher: "Mr. Smith" },
  { id: 2, studentName: "Emma Johnson", date: "2024-03-14", tag: "Good", remarks: "Completed extra credit assignment", teacher: "Mr. Smith" },
  { id: 3, studentName: "Michael Brown", date: "2024-03-13", tag: "Needs Improvement", remarks: "Did not submit homework on time", teacher: "Mr. Smith" },
  { id: 4, studentName: "Sarah Davis", date: "2024-03-12", tag: "Average", remarks: "Moderately attentive during class", teacher: "Mr. Smith" },
  { id: 5, studentName: "James Wilson", date: "2024-03-10", tag: "Discipline Issue", remarks: "Disrupted class during lecture", teacher: "Mr. Smith" },
];

const behaviourTags = ["Excellent", "Good", "Average", "Needs Improvement", "Discipline Issue"];

export default function BehaviourPage() {
  const [notes, setNotes] = useState(mockBehaviourNotes);
  const [formData, setFormData] = useState({
    studentId: "",
    tag: "",
    remarks: "",
  });

  const getTagBadge = (tag: string) => {
    const styles: Record<string, string> = {
      "Excellent": "bg-green-100 text-green-700 border-green-200",
      "Good": "bg-blue-100 text-blue-700 border-blue-200",
      "Average": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Needs Improvement": "bg-orange-100 text-orange-700 border-orange-200",
      "Discipline Issue": "bg-red-100 text-red-700 border-red-200",
    };

    const icons: Record<string, React.ReactNode> = {
      "Excellent": <Star className="h-3 w-3 mr-1" />,
      "Good": <CheckCircle className="h-3 w-3 mr-1" />,
      "Average": <User className="h-3 w-3 mr-1" />,
      "Needs Improvement": <AlertTriangle className="h-3 w-3 mr-1" />,
      "Discipline Issue": <AlertTriangle className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge className={`${styles[tag]} flex items-center`} variant="outline">
        {icons[tag]}
        {tag}
      </Badge>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.tag || !formData.remarks) {
      toast.error("Please fill in all required fields");
      return;
    }

    const student = mockStudents.find((s) => s.id === parseInt(formData.studentId));
    if (!student) return;

    const newNote = {
      id: notes.length + 1,
      studentName: student.name,
      date: new Date().toISOString().split("T")[0],
      tag: formData.tag,
      remarks: formData.remarks,
      teacher: "Mr. Smith",
    };

    setNotes([newNote, ...notes]);
    toast.success("Behaviour note added successfully!");
    setFormData({ studentId: "", tag: "", remarks: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Behaviour Notes</h1>
        <p className="text-muted-foreground">Record and track student behaviour observations</p>
      </div>

      {/* Add Behaviour Note Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Add Behaviour Note
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Student *</Label>
                <Select value={formData.studentId} onValueChange={(v) => setFormData({ ...formData, studentId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} ({student.class} - {student.section}, Roll: {student.roll})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Behaviour Tag *</Label>
                <Select value={formData.tag} onValueChange={(v) => setFormData({ ...formData, tag: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select behaviour type" />
                  </SelectTrigger>
                  <SelectContent>
                    {behaviourTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Detailed Notes *</Label>
              <Textarea
                id="remarks"
                placeholder="Describe the student's behaviour in detail..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                rows={4}
              />
            </div>

            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Submit Note
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Behaviour Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Behaviour Notes History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Behaviour Tag</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Teacher</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.studentName}</TableCell>
                  <TableCell>{note.date}</TableCell>
                  <TableCell>{getTagBadge(note.tag)}</TableCell>
                  <TableCell className="max-w-md truncate">{note.remarks}</TableCell>
                  <TableCell>{note.teacher}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
