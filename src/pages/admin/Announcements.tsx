import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
import {
  Plus,
  Megaphone,
  Edit,
  Trash2,
  Eye,
  Send,
  Calendar,
  Target,
  Users,
  Pin,
  Archive,
  Copy,
  Search,
  Filter,
  Bell,
  Mail,
  Smartphone,
  Globe,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { announcementService, type Announcement, type CreateAnnouncementData, type AnnouncementStats } from "@/services/announcementService";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    priority: "all", 
    status: "all",
    search: "",
  });

  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: "",
    content: "",
    type: "general",
    priority: "medium",
    targetAudience: ["all"],
    targetClasses: [],
    targetSections: [],
    targetUsers: [],
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Next week
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Tomorrow
    deliveryMethods: {
      email: true,
      sms: false,
      push: true,
      portal: true,
    },
    tags: [],
    allowComments: true,
    isPinned: false,
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [announcementsData, statsData] = await Promise.all([
        announcementService.getAllAnnouncements(filters),
        announcementService.getAnnouncementStats(),
      ]);
      
      setAnnouncements(announcementsData?.data || []);
      console.log('Announcements data:', announcementsData?.data);
      setStats(statsData || {
        total: 0,
        active: 0,
        expired: 0,
        scheduled: 0,
        byType: {
          general: 0,
          academic: 0,
          fees: 0,
          event: 0,
          urgent: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
        readStats: {
          totalReads: 0,
          totalViews: 0,
          averageReadRate: 0,
        },
        recentActivity: [],
      });
    } catch (error) {
      toast.error("Failed to load announcements");
      console.error(error);
      // Set default stats on error
      setStats({
        total: 0,
        active: 0,
        expired: 0,
        scheduled: 0,
        byType: {
          general: 0,
          academic: 0,
          fees: 0,
          event: 0,
          urgent: 0,
        },
        byPriority: {
          low: 0,
          medium: 0,
          high: 0,
          urgent: 0,
        },
        readStats: {
          totalReads: 0,
          totalViews: 0,
          averageReadRate: 0,
        },
        recentActivity: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement._id, formData);
        toast.success("Announcement updated successfully!");
      } else {
        await announcementService.createAnnouncement(formData);
        toast.success("Announcement created successfully!");
      }
      
      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error("Failed to save announcement");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await announcementService.deleteAnnouncement(id);
      toast.success("Announcement deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete announcement");
      console.error(error);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      targetClasses: announcement.targetClasses,
      targetSections: announcement.targetSections,
      targetUsers: announcement.targetUsers,
      expiryDate: announcement.expiryDate,
      scheduledDate: announcement.scheduledDate,
      deliveryMethods: announcement.deliveryMethods,
      tags: announcement.tags,
      allowComments: announcement.allowComments,
      isPinned: announcement.isPinned,
    });
    setDialogOpen(true);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await announcementService.markAsRead(id);
      toast.success("Marked as read");
      loadData();
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await announcementService.togglePin(id);
      toast.success("Pin status updated");
      loadData();
    } catch (error) {
      toast.error("Failed to update pin status");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await announcementService.duplicateAnnouncement(id);
      toast.success("Announcement duplicated successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to duplicate announcement");
    }
  };

  const handleSend = async (id: string) => {
    try {
      const result = await announcementService.sendAnnouncement(id);
      toast.success(`Announcement sent to ${result.sentCount} users!`);
      loadData();
    } catch (error) {
      toast.error("Failed to send announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "general",
      priority: "medium",
      targetAudience: ["all"],
      targetClasses: [],
      targetSections: [],
      targetUsers: [],
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      deliveryMethods: {
        email: true,
        sms: false,
        push: true,
        portal: true,
      },
      tags: [],
      allowComments: true,
      isPinned: false,
    });
    setEditingAnnouncement(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "general": return "bg-blue-100 text-blue-800";
      case "academic": return "bg-purple-100 text-purple-800";
      case "fees": return "bg-green-100 text-green-800";
      case "event": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (announcement: Announcement) => {
    const now = new Date();
    const expiryDate = new Date(announcement.expiryDate);
    const scheduledDate = new Date(announcement.scheduledDate);
    
    if (scheduledDate > now) return "bg-blue-100 text-blue-800"; // Scheduled
    if (expiryDate < now) return "bg-gray-100 text-gray-800"; // Expired
    return "bg-green-100 text-green-800"; // Active
  };

  const getStatusText = (announcement: Announcement) => {
    const now = new Date();
    const expiryDate = new Date(announcement.expiryDate);
    const scheduledDate = new Date(announcement.scheduledDate);
    
    if (scheduledDate > now) return "Scheduled";
    if (expiryDate < now) return "Expired";
    return "Active";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">
            Manage school announcements and communications
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="fees">Fees</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter announcement content"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Audience *</Label>
                <Select value={formData.targetAudience[0]} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: [value] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students Only</SelectItem>
                    <SelectItem value="parents">Parents Only</SelectItem>
                    <SelectItem value="teachers">Teachers Only</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="datetime-local"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.deliveryMethods.email}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          deliveryMethods: { ...prev.deliveryMethods, email: checked }
                        }))}
                      />
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.deliveryMethods.sms}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          deliveryMethods: { ...prev.deliveryMethods, sms: checked }
                        }))}
                      />
                      <Label className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        SMS
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.deliveryMethods.push}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          deliveryMethods: { ...prev.deliveryMethods, push: checked }
                        }))}
                      />
                      <Label className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Push Notification
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.deliveryMethods.portal}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          deliveryMethods: { ...prev.deliveryMethods, portal: checked }
                        }))}
                      />
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Portal
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isPinned}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPinned: checked }))}
                  />
                  <Label className="flex items-center gap-2">
                    <Pin className="h-4 w-4" />
                    Pin Announcement
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.allowComments}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: checked }))}
                  />
                  <Label className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Allow Comments
                  </Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleCreateAnnouncement} disabled={submitting} className="flex-1">
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {editingAnnouncement ? "Update" : "Create"} Announcement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-800">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">Active</p>
                  <p className="text-2xl font-bold text-green-800">{stats?.active || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-800">{stats?.scheduled || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium">Read Rate</p>
                  <p className="text-2xl font-bold text-purple-800">{stats.readStats?.averageReadRate?.toFixed(1) || 0}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search announcements..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="fees">Fees</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Announcements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcements ({announcements?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Read By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements?.map((announcement) => (
                <TableRow key={announcement.id || announcement._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {announcement.isPinned && <Pin className="h-4 w-4 text-red-500" />}
                      {announcement.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(announcement.type)}>
                      {announcement.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(announcement)}>
                      {getStatusText(announcement)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600" />
                      <span>{announcement.readBy?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDuplicate(announcement.id || announcement._id)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleTogglePin(announcement.id || announcement._id)}>
                        <Pin className="h-3 w-3 mr-1" />
                        Pin
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(announcement.id || announcement._id)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!announcements || announcements.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No announcements found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>);
}
