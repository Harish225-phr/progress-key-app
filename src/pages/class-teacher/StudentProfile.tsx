import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockStudent = {
  id: 1,
  name: "John Smith",
  roll: "101",
  class: "10",
  section: "A",
  attendance: "95%",
  feeStatus: "Paid",
  behaviour: "Good",
};

const mockAttendance = [
  { month: "January", present: 20, absent: 2, percentage: "91%" },
  { month: "February", present: 18, absent: 1, percentage: "95%" },
  { month: "March", present: 21, absent: 1, percentage: "95%" },
];

const mockMarks = [
  { subject: "Mathematics", test: "Mid-Term", maxMarks: 100, obtained: 85, percentage: "85%" },
  { subject: "Science", test: "Mid-Term", maxMarks: 100, obtained: 78, percentage: "78%" },
  { subject: "English", test: "Mid-Term", maxMarks: 100, obtained: 92, percentage: "92%" },
  { subject: "Social Studies", test: "Mid-Term", maxMarks: 100, obtained: 88, percentage: "88%" },
];

const mockBehaviour = [
  { date: "2024-03-15", teacher: "Mrs. Anderson", subject: "Mathematics", remark: "Excellent participation", tag: "Good" },
  { date: "2024-03-10", teacher: "Mr. Johnson", subject: "Science", remark: "Completed homework on time", tag: "Good" },
  { date: "2024-03-05", teacher: "Ms. Williams", subject: "English", remark: "Outstanding presentation", tag: "Excellent" },
];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/class-teacher/students")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{mockStudent.name}</h1>
          <p className="text-muted-foreground">
            Class {mockStudent.class} - Section {mockStudent.section} | Roll No: {mockStudent.roll}
          </p>
        </div>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="behaviour">Behaviour</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-2xl font-bold text-accent">95%</p>
                  <p className="text-sm text-muted-foreground">Overall</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">59</p>
                  <p className="text-sm text-muted-foreground">Present</p>
                </div>
                <div className="text-center p-4 bg-destructive/10 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-sm text-muted-foreground">Absent</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance.map((record) => (
                    <TableRow key={record.month}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell>{record.present}</TableCell>
                      <TableCell>{record.absent}</TableCell>
                      <TableCell>{record.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Marks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Max Marks</TableHead>
                    <TableHead>Obtained</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMarks.map((mark, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{mark.subject}</TableCell>
                      <TableCell>{mark.test}</TableCell>
                      <TableCell>{mark.maxMarks}</TableCell>
                      <TableCell>{mark.obtained}</TableCell>
                      <TableCell>
                        <Badge variant={parseInt(mark.percentage) >= 80 ? "default" : "secondary"}>
                          {mark.percentage}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behaviour" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behaviour Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Remark</TableHead>
                    <TableHead>Tag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBehaviour.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {record.date}
                        </div>
                      </TableCell>
                      <TableCell>{record.teacher}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>{record.remark}</TableCell>
                      <TableCell>
                        <Badge variant={record.tag === "Excellent" ? "default" : "secondary"}>
                          {record.tag}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-semibold">Current Status</p>
                    <p className="text-sm text-muted-foreground">Last updated: 2024-03-15</p>
                  </div>
                  <Badge variant="default" className="text-lg px-4 py-2">
                    Paid
                  </Badge>
                </div>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-2">Payment History</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Q1 Fees (Jan-Mar)</span>
                      <span className="font-medium">₹15,000 - Paid</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Admission Fee</span>
                      <span className="font-medium">₹5,000 - Paid</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Update Fee Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
