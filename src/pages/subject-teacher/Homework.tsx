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
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileText, CalendarIcon, Trash2, Users, Paperclip, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockHomework = [
  { id: 1, subject: "Mathematics", class: "10th", section: "A", chapter: "Chapter 3", topic: "Quadratic Equations", dueDate: "2024-03-20", status: "Active", hasAttachment: true },
  { id: 2, subject: "Mathematics", class: "10th", section: "B", chapter: "Chapter 2", topic: "Linear Equations", dueDate: "2024-03-18", status: "Active", hasAttachment: false },
  { id: 3, subject: "Mathematics", class: "9th", section: "A", chapter: "Chapter 5", topic: "Triangles", dueDate: "2024-03-15", status: "Completed", hasAttachment: true },
];

const classes = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];

export default function HomeworkPage() {
  const [homework, setHomework] = useState(mockHomework);
  const [dueDate, setDueDate] = useState<Date>();
  const [formData, setFormData] = useState({
    class: "",
    section: "",
    subject: "Mathematics",
    chapter: "",
    topic: "",
    description: "",
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.class || !formData.section || !formData.chapter || !formData.topic || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newHomework = {
      id: homework.length + 1,
      subject: formData.subject,
      class: formData.class,
      section: formData.section,
      chapter: formData.chapter,
      topic: formData.topic,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      status: "Active",
      hasAttachment: !!formData.file,
    };

    setHomework([newHomework, ...homework]);
    toast.success("Homework assigned to entire class successfully!");
    setFormData({
      class: "",
      section: "",
      subject: "Mathematics",
      chapter: "",
      topic: "",
      description: "",
      file: null,
    });
    setDueDate(undefined);
  };

  const handleDelete = (id: number) => {
    setHomework(homework.filter((h) => h.id !== id));
    toast.success("Homework deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assign Homework</h1>
        <p className="text-muted-foreground">Bulk assign homework to entire class</p>
      </div>

      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            New Homework Assignment
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

              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  placeholder="Enter topic name"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Homework Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the homework assignment in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Attachment (Optional)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90">
              <Users className="h-4 w-4 mr-2" />
              Assign to Entire Class
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Homework List */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Homework</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Class / Section</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Attachments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homework.map((hw) => (
                <TableRow key={hw.id}>
                  <TableCell className="font-medium">{hw.subject}</TableCell>
                  <TableCell>{hw.class} - {hw.section}</TableCell>
                  <TableCell>{hw.chapter}</TableCell>
                  <TableCell>{hw.topic}</TableCell>
                  <TableCell>{hw.dueDate}</TableCell>
                  <TableCell>
                    {hw.hasAttachment ? (
                      <Paperclip className="h-4 w-4 text-primary" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={hw.status === "Active" ? "default" : "secondary"}>
                      {hw.status === "Active" ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {hw.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(hw.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
