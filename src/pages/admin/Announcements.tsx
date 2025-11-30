import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Megaphone, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mockAnnouncements = [
  { id: 1, title: "Annual Sports Day", description: "Sports day scheduled for next week", date: "2024-01-15", audience: "Whole School", status: "Active" },
  { id: 2, title: "Parent-Teacher Meeting", description: "PTM on January 25th", date: "2024-01-10", audience: "Whole School", status: "Active" },
  { id: 3, title: "Science Fair Registration", description: "Register for science fair by Jan 20", date: "2024-01-08", audience: "Whole School", status: "Active" },
  { id: 4, title: "Holiday Notice", description: "School closed on Republic Day", date: "2024-01-05", audience: "Whole School", status: "Active" },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateAnnouncement = () => {
    toast.success("Announcement created successfully!");
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Announcement deleted!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcement Management</h1>
          <p className="text-muted-foreground">Create and manage school-wide announcements</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter announcement title" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter announcement details"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label>Audience</Label>
                  <div className="flex items-center gap-2 h-10">
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Whole School</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateAnnouncement} className="w-full">
                Create Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{announcements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently visible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">New announcements</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{announcement.description}</TableCell>
                  <TableCell>{announcement.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{announcement.audience}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{announcement.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
