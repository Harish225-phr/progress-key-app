import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, FileText, Filter } from "lucide-react";
import { toast } from "sonner";
import { auditLogService, type AuditLogEntry } from "@/services/auditLogService";

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [action, setAction] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditLogService.list({
        page,
        limit,
        ...(action ? { action } : {}),
        ...(resourceType ? { resourceType } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      });
      setLogs((res?.data as AuditLogEntry[]) ?? []);
    } catch {
      toast.error("Failed to load audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await auditLogService.stats(
        startDate || endDate ? { startDate, endDate } : undefined
      );
      setStats(res ?? null);
    } catch {
      setStats(null);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, action, resourceType, startDate, endDate]);

  useEffect(() => {
    fetchStats();
  }, [startDate, endDate]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground">Activity and audit trail for admin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Input
                placeholder="e.g. login, create"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Resource type</Label>
              <Input
                placeholder="e.g. User, Student"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Start date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => fetchLogs()} variant="secondary">
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && Object.keys(stats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(stats, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Log entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No audit logs found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Success</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={String(log.id)}>
                    <TableCell>
                      {log.createdAt
                        ? new Date(log.createdAt as string).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>{String(log.action ?? "-")}</TableCell>
                    <TableCell>{String(log.resourceType ?? "-")}</TableCell>
                    <TableCell>{String(log.userId ?? "-")}</TableCell>
                    <TableCell>{log.success != null ? (log.success ? "Yes" : "No") : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {page}</span>
            <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
