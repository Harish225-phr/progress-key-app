import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Download, Eye } from "lucide-react";

const mockMaterials = [
  { id: 1, title: "Quadratic Equations Notes", type: "PDF", subject: "Mathematics", class: "10-A", teacher: "Dr. Robert Smith", date: "2024-01-15" },
  { id: 2, title: "Physics Lab Manual", type: "PDF", subject: "Physics", class: "11-B", teacher: "Dr. Robert Smith", date: "2024-01-14" },
  { id: 3, title: "Chemical Reactions Diagram", type: "Image", subject: "Chemistry", class: "9-A", teacher: "Ms. Jennifer Wilson", date: "2024-01-13" },
  { id: 4, title: "English Grammar Video", type: "Video", subject: "English", class: "9-B", teacher: "Mr. David Brown", date: "2024-01-12" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF":
      return <FileText className="h-4 w-4 text-red-600" />;
    case "Image":
      return <Image className="h-4 w-4 text-blue-600" />;
    case "Video":
      return <Video className="h-4 w-4 text-purple-600" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export default function Materials() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Materials</h1>
        <p className="text-muted-foreground">View all uploaded study materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground mt-1">Across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">PDF Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              156
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Most common type</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              64
              <Image className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Diagrams & charts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              27
              <Video className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tutorial videos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Materials List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(material.type)}
                      <Badge variant="outline">{material.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{material.subject}</TableCell>
                  <TableCell>{material.class}</TableCell>
                  <TableCell>{material.teacher}</TableCell>
                  <TableCell>{material.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
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
