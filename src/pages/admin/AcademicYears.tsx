import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Plus, Loader2, Check, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { academicYearService } from "@/services/academicYearService";
import { useAcademicYear } from "@/hooks/useAcademicYear";

export default function AcademicYears() {
  const { list, current, loading, refetchList, refetchCurrent, setCurrentYear } =
    useAcademicYear();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [settingCurrentId, setSettingCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });

  useEffect(() => {
    refetchList();
    refetchCurrent();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Academic year name required (e.g. 2024-2025)");
      return;
    }
    setSubmitting(true);
    try {
      await academicYearService.create({
        name: form.name.trim(),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      });
      toast.success("Academic year created!");
      setDialogOpen(false);
      setForm({ name: "", startDate: "", endDate: "" });
      await refetchList();
      await refetchCurrent();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetCurrent = async (id: string) => {
    setSettingCurrentId(id);
    try {
      const ok = await setCurrentYear(id);
      if (ok) toast.success("Current academic year updated!");
      else toast.error("Failed to set current year");
    } catch {
      toast.error("Failed to set current year");
    } finally {
      setSettingCurrentId(null);
    }
  };

  const currentId = current?.id ?? null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Year</h1>
          <p className="text-muted-foreground">
            Create and set current academic year (exams, fees, class teacher use this)
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Academic Year
        </Button>
      </div>

      {current && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">Current academic year:</span>
              <Badge variant="default">{current.name ?? current.id}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            All Academic Years
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : list.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No academic years. Click &quot;Add Academic Year&quot; to create one, then set as current.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((ay) => (
                  <TableRow key={ay.id}>
                    <TableCell className="font-medium">
                      {ay.name ?? ay.id}
                    </TableCell>
                    <TableCell>
                      {ay.startDate
                        ? new Date(ay.startDate).toLocaleDateString()
                        : "–"}
                    </TableCell>
                    <TableCell>
                      {ay.endDate
                        ? new Date(ay.endDate).toLocaleDateString()
                        : "–"}
                    </TableCell>
                    <TableCell>
                      {currentId === ay.id ? (
                        <Badge>Current</Badge>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {currentId !== ay.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={settingCurrentId !== null}
                          onClick={() => handleSetCurrent(ay.id)}
                        >
                          {settingCurrentId === ay.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-1" />
                          )}
                          Set as current
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Academic Year</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="ay-name">Name * (e.g. 2024-2025)</Label>
              <Input
                id="ay-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="2024-2025"
                disabled={submitting}
              />
            </div>
            <div>
              <Label htmlFor="ay-start">Start date (optional)</Label>
              <Input
                id="ay-start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                disabled={submitting}
              />
            </div>
            <div>
              <Label htmlFor="ay-end">End date (optional)</Label>
              <Input
                id="ay-end"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                disabled={submitting}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
