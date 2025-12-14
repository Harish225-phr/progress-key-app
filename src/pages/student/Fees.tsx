import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DollarSign,
  CheckCircle,
  Download,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FeesPage = () => {
  // Toggle this to see different states
  const [isPaid, setIsPaid] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

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

      {/* Toggle Button for Demo */}
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
