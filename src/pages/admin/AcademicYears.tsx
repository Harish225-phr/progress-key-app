import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarRange, Plus, Loader2, Check, CheckCircle, Trash2, Palmtree, X } from "lucide-react";
import { toast } from "sonner";
import { academicYearService, type AcademicYear, type Term, type Holiday } from "@/services/academicYearService";
import { useAcademicYear } from "@/hooks/useAcademicYear";

export default function AcademicYears() {
  const { list, current, loading, refetchList, refetchCurrent, setCurrentYear } =
    useAcademicYear();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [settingCurrentId, setSettingCurrentId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });
  const [holidayForm, setHolidayForm] = useState({ name: "", startDate: "", endDate: "", description: "" });
  const [termForm, setTermForm] = useState({ name: "", startDate: "", endDate: "" });

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

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear || !holidayForm.name.trim() || !holidayForm.startDate || !holidayForm.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await academicYearService.addHoliday(selectedYear.id, {
        name: holidayForm.name.trim(),
        startDate: holidayForm.startDate,
        endDate: holidayForm.endDate,
        description: holidayForm.description || undefined,
      });
      toast.success("Holiday added successfully!");
      setHolidayDialogOpen(false);
      setHolidayForm({ name: "", startDate: "", endDate: "", description: "" });
      await refetchList();
      await refetchCurrent();
      // Refresh selected year
      const updatedList = await academicYearService.getList();
      const updated = updatedList.find(y => y.id === selectedYear.id);
      if (updated) setSelectedYear(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add holiday");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYear || !termForm.name.trim() || !termForm.startDate || !termForm.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await academicYearService.addTerm(selectedYear.id, {
        name: termForm.name.trim(),
        startDate: termForm.startDate,
        endDate: termForm.endDate,
      });
      toast.success("Term added successfully!");
      setTermDialogOpen(false);
      setTermForm({ name: "", startDate: "", endDate: "" });
      await refetchList();
      await refetchCurrent();
      // Refresh selected year
      const updatedList = await academicYearService.getList();
      const updated = updatedList.find(y => y.id === selectedYear.id);
      if (updated) setSelectedYear(updated);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add term");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (year: AcademicYear) => {
    setSelectedYear(year);
  };

  const currentId = current?.id ?? null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Year</h1>
          <p className="text-muted-foreground">
            Create and manage academic years, terms, and holidays
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
              {current.startDate && current.endDate && (
                <span className="text-muted-foreground text-sm ml-2">
                  ({new Date(current.startDate).toLocaleDateString()} - {new Date(current.endDate).toLocaleDateString()})
                </span>
              )}
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
              No academic years. Click "Add Academic Year" to create one, then set as current.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead>Holidays</TableHead>
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
                      <Badge variant="outline">{ay.terms?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ay.holidays?.length || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {currentId === ay.id ? (
                        <Badge>Current</Badge>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(ay)}
                        >
                          View Details
                        </Button>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      {selectedYear && (
        <Dialog open={!!selectedYear} onOpenChange={(open) => !open && setSelectedYear(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5" />
                {selectedYear.name || selectedYear.id} - Details
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="terms" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="terms" className="flex-1">
                  Terms ({selectedYear.terms?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="holidays" className="flex-1">
                  Holidays ({selectedYear.holidays?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="terms" className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setTermDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Term
                  </Button>
                </div>
                {selectedYear.terms && selectedYear.terms.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedYear.terms.map((term, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{term.name}</TableCell>
                          <TableCell>{new Date(term.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(term.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {term.isActive ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No terms added yet.</p>
                )}
              </TabsContent>

              <TabsContent value="holidays" className="space-y-4">
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => setHolidayDialogOpen(true)}>
                    <Palmtree className="h-4 w-4 mr-1" />
                    Add Holiday
                  </Button>
                </div>
                {selectedYear.holidays && selectedYear.holidays.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedYear.holidays.map((holiday, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{holiday.name}</TableCell>
                          <TableCell>{new Date(holiday.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(holiday.endDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {holiday.description || "–"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No holidays added yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Holiday Dialog */}
      <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palmtree className="h-5 w-5" />
              Add Holiday
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddHoliday} className="space-y-4">
            <div>
              <Label htmlFor="holiday-name">Holiday Name *</Label>
              <Input
                id="holiday-name"
                value={holidayForm.name}
                onChange={(e) => setHolidayForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Summer Break, Winter Vacation"
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="holiday-start">Start Date *</Label>
                <Input
                  id="holiday-start"
                  type="date"
                  value={holidayForm.startDate}
                  onChange={(e) => setHolidayForm((f) => ({ ...f, startDate: e.target.value }))}
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="holiday-end">End Date *</Label>
                <Input
                  id="holiday-end"
                  type="date"
                  value={holidayForm.endDate}
                  onChange={(e) => setHolidayForm((f) => ({ ...f, endDate: e.target.value }))}
                  disabled={submitting}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="holiday-desc">Description (optional)</Label>
              <Textarea
                id="holiday-desc"
                value={holidayForm.description}
                onChange={(e) => setHolidayForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Additional details about the holiday"
                disabled={submitting}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setHolidayDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Holiday"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Term Dialog */}
      <Dialog open={termDialogOpen} onOpenChange={setTermDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" />
              Add Term
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTerm} className="space-y-4">
            <div>
              <Label htmlFor="term-name">Term Name *</Label>
              <Input
                id="term-name"
                value={termForm.name}
                onChange={(e) => setTermForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g., Term 1, First Term"
                disabled={submitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="term-start">Start Date *</Label>
                <Input
                  id="term-start"
                  type="date"
                  value={termForm.startDate}
                  onChange={(e) => setTermForm((f) => ({ ...f, startDate: e.target.value }))}
                  disabled={submitting}
                />
              </div>
              <div>
                <Label htmlFor="term-end">End Date *</Label>
                <Input
                  id="term-end"
                  type="date"
                  value={termForm.endDate}
                  onChange={(e) => setTermForm((f) => ({ ...f, endDate: e.target.value }))}
                  disabled={submitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTermDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Term"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Academic Year Dialog */}
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
