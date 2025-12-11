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
import { toast } from "sonner";
import { Upload, FileText, Video, Image, File, Trash2, Link as LinkIcon } from "lucide-react";

const mockMaterials = [
  { id: 1, title: "Chapter 1 - Introduction to Algebra", fileType: "PDF", class: "10th", section: "A", chapter: "Chapter 1", uploadedBy: "Mr. Smith", uploadedAt: "2024-03-10" },
  { id: 2, title: "Trigonometry Basics Video", fileType: "Video", class: "10th", section: "B", chapter: "Chapter 3", uploadedBy: "Mr. Smith", uploadedAt: "2024-03-08" },
  { id: 3, title: "Geometry Diagrams", fileType: "Image", class: "9th", section: "A", chapter: "Chapter 2", uploadedBy: "Mr. Smith", uploadedAt: "2024-03-05" },
  { id: 4, title: "Linear Equations PPT", fileType: "PPT", class: "10th", section: "A", chapter: "Chapter 4", uploadedBy: "Mr. Smith", uploadedAt: "2024-03-01" },
];

const classes = ["9th", "10th", "11th", "12th"];
const sections = ["A", "B", "C", "D"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English"];
const chapters = ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState(mockMaterials);
  const [formData, setFormData] = useState({
    title: "",
    class: "",
    section: "",
    subject: "Mathematics",
    chapter: "",
    description: "",
    videoLink: "",
    file: null as File | null,
  });

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "PDF": return <FileText className="h-4 w-4 text-red-500" />;
      case "Video": return <Video className="h-4 w-4 text-blue-500" />;
      case "Image": return <Image className="h-4 w-4 text-green-500" />;
      case "PPT": return <File className="h-4 w-4 text-orange-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.class || !formData.section || !formData.chapter) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newMaterial = {
      id: materials.length + 1,
      title: formData.title,
      fileType: formData.file?.type.includes("pdf") ? "PDF" : formData.videoLink ? "Video" : "File",
      class: formData.class,
      section: formData.section,
      chapter: formData.chapter,
      uploadedBy: "Mr. Smith",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setMaterials([newMaterial, ...materials]);
    toast.success("Study material uploaded successfully!");
    setFormData({
      title: "",
      class: "",
      section: "",
      subject: "Mathematics",
      chapter: "",
      description: "",
      videoLink: "",
      file: null,
    });
  };

  const handleDelete = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast.success("Material deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Study Material</h1>
        <p className="text-muted-foreground">Upload PDFs, videos, images, and presentations for your students</p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            New Material
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Upload Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter material title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
                <Label>Select Chapter *</Label>
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
                <Label htmlFor="videoLink">Video Link (Optional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="videoLink"
                    className="pl-10"
                    placeholder="https://youtube.com/..."
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the material..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File (PDF, Word, Image, PPT)</Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
              </p>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Upload Material
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Title</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Class / Section</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileTypeIcon(material.fileType)}
                      <Badge variant="outline">{material.fileType}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{material.class} - {material.section}</TableCell>
                  <TableCell>{material.chapter}</TableCell>
                  <TableCell>{material.uploadedBy}</TableCell>
                  <TableCell>{material.uploadedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(material.id)}
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
