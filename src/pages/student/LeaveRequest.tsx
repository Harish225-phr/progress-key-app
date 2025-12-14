import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Send,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  FileText,
} from "lucide-react";

// Dummy data
const leaveHistory = [
  {
    id: 1,
    fromDate: "Dec 5, 2024",
    toDate: "Dec 5, 2024",
    reason: "Medical appointment",
    status: "approved",
    submittedAt: "Dec 4, 2024",
  },
  {
    id: 2,
    fromDate: "Nov 20, 2024",
    toDate: "Nov 22, 2024",
    reason: "Family function - wedding",
    status: "approved",
    submittedAt: "Nov 15, 2024",
  },
  {
    id: 3,
    fromDate: "Nov 10, 2024",
    toDate: "Nov 10, 2024",
    reason: "Not feeling well",
    status: "pending",
    submittedAt: "Nov 9, 2024",
  },
  {
    id: 4,
    fromDate: "Oct 25, 2024",
    toDate: "Oct 28, 2024",
    reason: "Out of station",
    status: "rejected",
    submittedAt: "Oct 20, 2024",
  },
];

const LeaveRequestPage = () => {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Leave request submitted successfully!");
      setFromDate(undefined);
      setToDate(undefined);
      setReason("");
      setFileName("");
      setSubmitting(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  const approvedCount = leaveHistory.filter((l) => l.status === "approved").length;
  const pendingCount = leaveHistory.filter((l) => l.status === "pending").length;
  const rejectedCount = leaveHistory.filter((l) => l.status === "rejected").length;

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Request</h1>
        <p className="text-muted-foreground">Submit and track your leave requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto text-green-500 mb-2" />
            <p className="text-lg font-bold text-green-600">{approvedCount}</p>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
            <p className="text-lg font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <XCircle className="h-6 w-6 mx-auto text-red-500 mb-2" />
            <p className="text-lg font-bold text-red-600">{rejectedCount}</p>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Submit New Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">To Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Please provide the reason for your leave..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    // Simulate file selection
                    setFileName("medical_certificate.pdf");
                    toast.info("File selected: medical_certificate.pdf");
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {fileName || "Choose File"}
                </Button>
                {fileName && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFileName("")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload medical certificate or supporting document (PDF, JPG, PNG)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Leave Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveHistory.map((leave) => (
              <div
                key={leave.id}
                className="p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(leave.status)}
                    </div>
                    <p className="font-medium text-foreground">{leave.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {leave.fromDate === leave.toDate
                            ? leave.fromDate
                            : `${leave.fromDate} - ${leave.toDate}`}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {leave.submittedAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveRequestPage;
