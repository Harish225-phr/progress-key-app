import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, Search, Filter, Download, RefreshCw, Eye, AlertTriangle, CheckCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { auditLogService, AuditLogEntry, AuditLogResponse } from "@/services/auditLogService";
import { toast } from "sonner";

interface AuditLogsProps {
  userId?: string;
  showUserActivityOnly?: boolean;
}

const AuditLogs = ({ userId, showUserActivityOnly = false }: AuditLogsProps) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<any>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [selectedResourceType, setSelectedResourceType] = useState<string>("");
  const [selectedSuccess, setSelectedSuccess] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const limit = 50;

  const actions = ["LOGIN", "LOGOUT", "TOKEN_REFRESH", "CREATE", "UPDATE", "DELETE", "VIEW"];
  const resourceTypes = ["User", "Class", "Section", "Subject", "Student", "Teacher", "Exam", "Result"];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let response: AuditLogResponse;

      const params: any = {
        page: currentPage,
        limit,
      };

      if (selectedAction) params.action = selectedAction;
      if (selectedResourceType) params.resourceType = selectedResourceType;
      if (selectedSuccess) params.success = selectedSuccess === "true";
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      if (searchTerm) params.search = searchTerm;

      if (showUserActivityOnly && userId) {
        response = await auditLogService.getUserActivity(userId, params);
      } else if (selectedSuccess === "false") {
        response = await auditLogService.getErrorLogs(params);
      } else if (startDate && endDate) {
        response = await auditLogService.getLogsByDateRange(
          startDate.toISOString(),
          endDate.toISOString(),
          params
        );
      } else {
        response = await auditLogService.getAllLogs(params);
      }

      setLogs(response.data || []);
      setTotalPages(response.pages || 1);
      setTotal(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      
      const statsData = await auditLogService.getSystemStats(params);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (!showUserActivityOnly) {
      fetchStats();
    }
  }, [currentPage, selectedAction, selectedResourceType, selectedSuccess, startDate, endDate, searchTerm]);

  const handleRefresh = () => {
    fetchLogs();
    fetchStats();
  };

  const handleExport = () => {
    // Export functionality can be implemented here
    toast.info("Export functionality coming soon!");
  };

  const resetFilters = () => {
    setSelectedAction("");
    setSelectedResourceType("");
    setSelectedSuccess("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getStatusBadge = (success: boolean) => {
    return success ? (
      <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Success
      </Badge>
    ) : (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Failed
      </Badge>
    );
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: "bg-blue-100 text-blue-800",
      LOGOUT: "bg-gray-100 text-gray-800",
      TOKEN_REFRESH: "bg-purple-100 text-purple-800",
      CREATE: "bg-green-100 text-green-800",
      UPDATE: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
      VIEW: "bg-indigo-100 text-indigo-800",
    };

    return (
      <Badge className={colors[action] || "bg-gray-100 text-gray-800"}>
        {action}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {showUserActivityOnly ? "User Activity" : "Audit Logs"}
          </h1>
          <p className="text-muted-foreground">
            {showUserActivityOnly 
              ? "View user activity and actions" 
              : "Monitor and track system activity and user actions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {!showUserActivityOnly && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.successfulLogs || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.failedLogs || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeUsers || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label>Action</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Actions</SelectItem>
                    {actions.map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Resource Type</Label>
                <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Resources</SelectItem>
                    {resourceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select value={selectedSuccess} onValueChange={setSelectedSuccess}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="true">Success</SelectItem>
                    <SelectItem value="false">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {showUserActivityOnly ? "User Activity Logs" : "System Audit Logs"}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({total} total records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow key={log._id || index}>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(log.createdAt), "PPp")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">
                            {log.userRole}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.resourceType}</div>
                          <div className="text-muted-foreground">
                            ID: {log.resourceId?.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {log.ipAddress}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(log.success)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
