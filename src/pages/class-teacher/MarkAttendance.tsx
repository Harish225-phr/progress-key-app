import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Calendar, CheckCircle, Users } from "lucide-react";

const mockStudents = [
  { id: 1, name: "John Smith", roll: "101" },
  { id: 2, name: "Sarah Johnson", roll: "102" },
  { id: 3, name: "Michael Brown", roll: "103" },
  { id: 4, name: "Emily Davis", roll: "104" },
  { id: 5, name: "David Wilson", roll: "105" },
  { id: 6, name: "Jessica Martinez", roll: "106" },
  { id: 7, name: "Daniel Anderson", roll: "107" },
  { id: 8, name: "Sophia Taylor", roll: "108" },
];

export default function MarkAttendance() {
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const toggleAttendance = (studentId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<number, boolean> = {};
    mockStudents.forEach((student) => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
    toast.success("Marked all students present");
  };

  const markAllAbsent = () => {
    setAttendance({});
    toast.success("Marked all students absent");
  };

  const handleSubmit = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    toast.success(`Attendance submitted! ${presentCount} students marked present`);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = mockStudents.length - presentCount;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-muted-foreground">Mark today's attendance for your class</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Date</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{presentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{absentCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student List</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllPresent}>
                Mark All Present
              </Button>
              <Button variant="outline" size="sm" onClick={markAllAbsent}>
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/5 transition-colors"
              >
                <Checkbox
                  id={`student-${student.id}`}
                  checked={attendance[student.id] || false}
                  onCheckedChange={() => toggleAttendance(student.id)}
                />
                <label
                  htmlFor={`student-${student.id}`}
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Roll No: {student.roll}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {attendance[student.id] ? (
                      <span className="text-accent">Present</span>
                    ) : (
                      <span className="text-muted-foreground">Absent</span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-4">
            <Button onClick={handleSubmit} className="flex-1">
              Submit Attendance
            </Button>
            <Button variant="outline" onClick={() => setAttendance({})}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
