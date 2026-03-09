import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  DollarSign,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Receipt,
  TrendingUp,
  Users,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { parentService } from "@/services/parentService";

interface PaymentRecord {
  _id: string;
  childName: string;
  feeType: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  status: "success" | "failed" | "pending";
  transactionId?: string;
}

interface ChildFeeRecord {
  _id: string;
  childName: string;
  childId: string;
  feeRecords: Array<{
    feeType: string;
    amount: number;
    dueDate: string;
    paidDate?: string;
    status: "paid" | "pending" | "overdue";
    paymentMethod?: string;
  }>;
}

export default function ParentFees() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [childrenFees, setChildrenFees] = useState<ChildFeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: "online",
    transactionId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyData] = await Promise.all([
          parentService.getPaymentHistory(),
        ]);
        
        setPaymentHistory(historyData);
        
        // Load children and their fee records
        const children = await parentService.getChildren();
        const feesData = await Promise.all(
          children.map(async (child) => {
            const fees = await parentService.getChildFees(child._id);
            return {
              _id: child._id,
              childName: `${child.firstName} ${child.lastName}`,
              childId: child._id,
              feeRecords: fees,
            };
          })
        );
        
        setChildrenFees(feesData);
      } catch (error) {
        toast.error("Failed to load fee data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePayment = async () => {
    if (!selectedFee) return;

    try {
      const result = await parentService.makePayment({
        childId: selectedFee.childId,
        feeType: selectedFee.feeType,
        amount: selectedFee.amount,
        paymentMethod: paymentForm.paymentMethod as "online" | "cash" | "cheque",
        transactionId: paymentForm.transactionId || undefined,
      });

      if (result.success) {
        toast.success(result.message);
        setPaymentDialog(false);
        setSelectedFee(null);
        setPaymentForm({ paymentMethod: "online", transactionId: "" });
        
        // Reload data
        window.location.reload();
      }
    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
    }
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "online": return <CreditCard className="h-4 w-4" />;
      case "cash": return <DollarSign className="h-4 w-4" />;
      case "cheque": return <FileText className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const calculateTotalStats = () => {
    const totalFees = childrenFees.reduce((sum, child) => 
      sum + child.feeRecords.reduce((childSum, fee) => childSum + fee.amount, 0), 0
    );
    
    const totalPaid = childrenFees.reduce((sum, child) => 
      sum + child.feeRecords.filter(f => f.status === "paid").reduce((childSum, fee) => childSum + fee.amount, 0), 0
    );
    
    const totalPending = childrenFees.reduce((sum, child) => 
      sum + child.feeRecords.filter(f => f.status === "pending" || f.status === "overdue").reduce((childSum, fee) => childSum + fee.amount, 0), 0
    );

    return { totalFees, totalPaid, totalPending };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading fee data...</p>
        </div>
      </div>
    );
  }

  const stats = calculateTotalStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">
            Manage and track your children's fee payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Receipts
          </Button>
          <Button>
            <CreditCard className="h-4 w-4 mr-2" />
            Make Payment
          </Button>
        </div>
      </div>

      {/* Fee Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Fees</p>
                <p className="text-2xl font-bold text-blue-800">₹{stats.totalFees.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-800">₹{stats.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600 font-medium">Pending Amount</p>
                <p className="text-2xl font-bold text-red-800">₹{stats.totalPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Fee Records */}
      <div className="space-y-6">
        {childrenFees.map((child) => (
          <Card key={child._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {child.childName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {child.feeRecords.length} fee records
                  </Badge>
                  <Badge className={child.feeRecords.filter(f => f.status === "pending" || f.status === "overdue").length > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {child.feeRecords.filter(f => f.status === "pending" || f.status === "overdue").length > 0 ? "Pending" : "All Paid"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {child.feeRecords.map((fee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{fee.feeType}</TableCell>
                      <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                      <TableCell>{fee.dueDate}</TableCell>
                      <TableCell>{fee.paidDate || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getFeeStatusColor(fee.status)}>
                          {fee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {fee.paymentMethod ? (
                          <div className="flex items-center gap-1">
                            {getPaymentMethodIcon(fee.paymentMethod)}
                            <span className="text-sm capitalize">{fee.paymentMethod}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {fee.status !== "paid" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedFee({ ...fee, childId: child.childId });
                                setPaymentDialog(true);
                              }}
                            >
                              <CreditCard className="h-3 w-3 mr-1" />
                              Pay
                            </Button>
                          )}
                          {fee.status === "paid" && (
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Receipt
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {child.feeRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No fee records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child Name</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment._id}>
                  <TableCell className="font-medium">{payment.childName}</TableCell>
                  <TableCell>{payment.feeType}</TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className="text-sm capitalize">{payment.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.transactionId || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paymentHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No payment history found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Make Payment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFee && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{selectedFee.feeType}</span>
                  <span className="text-lg font-bold">₹{selectedFee.amount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">Due Date: {selectedFee.dueDate}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentForm.paymentMethod}
                onValueChange={(value) => setPaymentForm(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentForm.paymentMethod === "online" && (
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  value={paymentForm.transactionId}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setPaymentDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
