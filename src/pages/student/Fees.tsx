import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  DollarSign,
  CheckCircle,
  Download,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getStoredUser } from "@/services/authService";
import { feeService, type StudentFeeDetail } from "@/services/feeService";
import { useAcademicYear } from "@/hooks/useAcademicYear";

const FeesPage = () => {
  const { list: academicYears, current: currentYear } = useAcademicYear();
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [feeDetail, setFeeDetail] = useState<StudentFeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const user = getStoredUser();
  const studentId = user?.id ?? "";

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }
    const year = selectedAcademicYear || currentYear?.name || currentYear?.id;
    setLoading(true);
    feeService
      .getStudentDetails(studentId, year ? { academicYear: year } : undefined)
      .then(setFeeDetail)
      .catch(() => {
        setFeeDetail(null);
        toast.error("Failed to load fee details");
      })
      .finally(() => setLoading(false));
  }, [studentId, selectedAcademicYear, currentYear?.name, currentYear?.id]);

  const isPaid = feeDetail
    ? (feeDetail.pendingAmount ?? 0) <= 0 && (feeDetail.totalAmount ?? 0) > 0
    : true;

  const handlePayNow = () => {
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentSuccess(true);
      setIsPaid(true);
      toast.success("Payment successful!");
    }, 2000);
  };

  const handleDownloadReceipt = () => {
    toast.success("Receipt downloaded successfully!");
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Fee Payment</h1>
        <p className="text-muted-foreground">View and manage your fee status</p>
      </div>

      {academicYears.length > 0 && (
        <div className="space-y-2">
          <Label>Academic Year</Label>
          <Select
            value={selectedAcademicYear || (currentYear?.name ?? currentYear?.id ?? "")}
            onValueChange={setSelectedAcademicYear}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Current year" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((ay) => (
                <SelectItem key={ay.id} value={ay.name ?? ay.id}>
                  {ay.name ?? ay.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
      {/* Fee Status Card */}
      <Card className="overflow-hidden">
        {isPaid ? (
          // PAID STATE
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Fee Paid</h2>
              <p className="text-muted-foreground mb-8">
                Your fee has been paid successfully
              </p>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px]"
                onClick={handleDownloadReceipt}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Receipt
              </Button>
            </div>
          </CardContent>
        ) : (
          // PENDING STATE
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="h-20 w-20 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-10 w-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-orange-600 mb-2">Fee Pending</h2>
              <p className="text-muted-foreground mb-8">
                Your fee is pending. Please make the payment.
              </p>
              <Button
                size="lg"
                className="min-w-[200px]"
                onClick={handlePayNow}
                disabled={processing}
              >
                {processing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {feeDetail && (feeDetail.totalAmount ?? 0) > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">₹{feeDetail.totalAmount?.toLocaleString() ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid</span>
                <span className="text-green-600">₹{feeDetail.paidAmount?.toLocaleString() ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="text-destructive">₹{feeDetail.pendingAmount?.toLocaleString() ?? 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Button for Demo (when no API data) */}
      {!feeDetail && !loading && (
      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Demo: Toggle fee status to see different states
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant={isPaid ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPaid(true)}
            >
              Show Paid
            </Button>
            <Button
              variant={!isPaid ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPaid(false)}
            >
              Show Pending
            </Button>
          </div>
        </CardContent>
      </Card>
      )}
        </>
      )}

      {/* Payment Success Dialog */}
      <Dialog open={showPaymentSuccess} onOpenChange={setShowPaymentSuccess}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <p className="text-muted-foreground mb-6">
              Your fee has been paid successfully. You can now download your receipt.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={handleDownloadReceipt}>
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPaymentSuccess(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeesPage;
