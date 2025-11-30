import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const mockMappings = [
  { id: 1, teacher: "Dr. Robert Smith", class: "10", section: "A", subject: "Mathematics" },
  { id: 2, teacher: "Dr. Robert Smith", class: "11", section: "B", subject: "Physics" },
  { id: 3, teacher: "Ms. Jennifer Wilson", class: "9", section: "A", subject: "Chemistry" },
  { id: 4, teacher: "Ms. Jennifer Wilson", class: "10", section: "B", subject: "Chemistry" },
  { id: 5, teacher: "Mr. David Brown", class: "9", section: "A", subject: "English" },
  { id: 6, teacher: "Mr. David Brown", class: "9", section: "B", subject: "English" },
];

export default function Mapping() {
  const [mappings, setMappings] = useState(mockMappings);

  const handleAddMapping = () => {
    toast.success("Teacher mapping added successfully!");
  };

  const handleDeleteMapping = (id: number) => {
    setMappings(mappings.filter(m => m.id !== id));
    toast.success("Mapping removed successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teacher-Subject Mapping</h1>
        <p className="text-muted-foreground">Assign teachers to class-section-subject combinations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Select Teacher</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Dr. Robert Smith</SelectItem>
                  <SelectItem value="2">Ms. Jennifer Wilson</SelectItem>
                  <SelectItem value="3">Mr. David Brown</SelectItem>
                  <SelectItem value="4">Ms. Sarah Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">Class 9</SelectItem>
                  <SelectItem value="10">Class 10</SelectItem>
                  <SelectItem value="11">Class 11</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Section</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddMapping} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Mappings ({mappings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell className="font-medium">{mapping.teacher}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Class {mapping.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Section {mapping.section}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{mapping.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMapping(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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
