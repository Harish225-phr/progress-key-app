import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Megaphone, Calendar, Trash2, Plus } from "lucide-react";

const mockAnnouncements = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    description: "PTM scheduled for all parents on March 30th. Attendance is mandatory.",
    date: "2024-03-20",
  },
  {
    id: 2,
    title: "Sports Day Preparation",
    description: "Students should come in sports uniform next week for practice sessions.",
    date: "2024-03-18",
  },
  {
    id: 3,
    title: "Mid-Term Results",
    description: "Mid-term results will be shared with parents by end of this week.",
    date: "2024-03-15",
  },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddAnnouncement = () => {
    if (!title || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const newAnnouncement = {
      id: announcements.length + 1,
      title,
      description,
      date: new Date().toISOString().split("T")[0],
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle("");
    setDescription("");
    setShowForm(false);
    toast.success("Announcement created successfully");
  };

  const handleDelete = (id: number, title: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    toast.success(`Deleted: ${title}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Announcements</h1>
          <p className="text-muted-foreground">Create and manage announcements for your class</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Enter announcement description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddAnnouncement} className="flex-1">
                Create Announcement
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{announcement.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-3">{announcement.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {announcement.date}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(announcement.id, announcement.title)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No announcements yet</p>
            <p className="text-sm text-muted-foreground">
              Click "Create Announcement" to add your first announcement
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
