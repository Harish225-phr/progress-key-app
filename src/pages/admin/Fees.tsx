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
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const mockFees = [
  { id: 1, student: "John Smith", class: "10-A", amount: 15000, paid: 15000, pending: 0, status: "Paid", lastPayment: "2024-01-05" },
  { id: 2, student: "Sarah Johnson", class: "10-B", amount: 15000, paid: 10000, pending: 5000, status: "Pending", lastPayment: "2023-12-15" },
  { id: 3, student: "Michael Brown", class: "9-A", amount: 14000, paid: 14000, pending: 0, status: "Paid", lastPayment: "2024-01-10" },
  { id: 4, student: "Emily Davis", class: "9-B", amount: 14000, paid: 14000, pending: 0, status: "Paid", lastPayment: "2024-01-08" },
  { id: 5, student: "David Wilson", class: "11-A", amount: 16000, paid: 8000, pending: 8000, status: "Pending", lastPayment: "2023-11-20" },
];

export default function Fees() {
  const totalCollected = mockFees.reduce((sum, fee) => sum + fee.paid, 0);
  const totalPending = mockFees.reduce((sum, fee) => sum + fee.pending, 0);
  const totalAmount = mockFees.reduce((sum, fee) => sum + fee.amount, 0);
  const collectionRate = ((totalCollected / totalAmount) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fees Analytics</h1>
        <p className="text-muted-foreground">Track fee collection and pending payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 flex items-center gap-2">
              ₹{totalCollected.toLocaleString()}
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">This academic year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive flex items-center gap-2">
              ₹{totalPending.toLocaleString()}
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {collectionRate}%
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Students with Dues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockFees.filter(f => f.pending > 0).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of {mockFees.length} students</p>
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
              <Label>Payment Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Section</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student-wise Fee Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.student}</TableCell>
                  <TableCell>{fee.class}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      ₹{fee.amount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ₹{fee.paid.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-destructive font-medium">
                    {fee.pending > 0 ? `₹${fee.pending.toLocaleString()}` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={fee.status === "Paid" ? "default" : "destructive"}>
                      {fee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{fee.lastPayment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
