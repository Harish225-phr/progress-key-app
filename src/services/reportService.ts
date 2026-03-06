import { apiClient } from "@/api/client";
import { API_BASE_URL } from "@/api/endpoints";
import { getAccessToken } from "@/api/client";

const baseUrl = API_BASE_URL.replace(/\/$/, "");

async function fetchPdf(path: string): Promise<Blob> {
  const token = getAccessToken();
  const res = await fetch(`${baseUrl}/${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`Report failed: ${res.status}`);
  return res.blob();
}

/** Report card PDF: GET .../report-card/:studentId/:examId (download) or .../view (inline). */
export async function getReportCardPdf(
  studentId: string,
  examId: string,
  view: boolean
): Promise<Blob> {
  const path = view
    ? `reports/report-card/${studentId}/${examId}/view`
    : `reports/report-card/${studentId}/${examId}`;
  return fetchPdf(path);
}

/** Open report card in new tab (view) or trigger download */
export async function openReportCard(
  studentId: string,
  examId: string,
  view = true
): Promise<void> {
  const blob = await getReportCardPdf(studentId, examId, view);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  URL.revokeObjectURL(url);
}

/** Attendance report PDF. Required: startDate, endDate (YYYY-MM-DD). */
export async function getAttendanceReportPdf(
  studentId: string,
  startDate: string,
  endDate: string
): Promise<Blob> {
  const path = `reports/attendance/${studentId}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
  return fetchPdf(path);
}

export async function openAttendanceReport(
  studentId: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const blob = await getAttendanceReportPdf(studentId, startDate, endDate);
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  URL.revokeObjectURL(url);
}

/** Bulk report cards: POST body { classId, sectionId, examId }. Returns JSON with success/error counts. */
export async function bulkReportCards(payload: {
  classId: string;
  sectionId: string;
  examId: string;
}): Promise<{ success?: number; error?: number; [key: string]: unknown }> {
  return apiClient.post("reports/report-cards/bulk", payload);
}
