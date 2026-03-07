import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave" | "Excused";

export interface AttendanceData {
  enrollmentId: string;
  studentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  date: string;
  status: AttendanceStatus;
}

export interface BulkAttendanceRecord {
  enrollmentId: string;
  studentId: string;
  status: AttendanceStatus;
}

export interface BulkAttendanceData {
  academicYearId: string;
  classId: string;
  sectionId: string;
  date: string;
  attendanceRecords: BulkAttendanceRecord[];
}

export interface Enrollment {
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
  };
  academicYearId: {
    _id: string;
    name: string;
    isActive: boolean;
  };
  classId: {
    _id: string;
    name: string;
  };
  sectionId: {
    _id: string;
    name: string;
  };
  rollNumber?: number;
  status: string;
}

export interface Attendance {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentName?: string;
  admissionNumber?: string;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  rollNumber?: number;
  date: string;
  status: AttendanceStatus;
  createdAt?: string;
}

export interface AttendanceSummary {
  totalStudents: number;
  present: number;
  absent: number;
  leave: number;
  late: number;
  attendance: Array<{
    enrollmentId: string;
    studentId: string;
    status: AttendanceStatus;
  }>;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
} | string;

type AttendanceApiResponse = {
  id?: string;
  _id?: string;
  enrollmentId?: PopulatedRef;
  studentId?: PopulatedRef;
  academicYearId?: PopulatedRef;
  classId?: PopulatedRef;
  sectionId?: PopulatedRef;
  date?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AttendanceListResponse = {
  success?: boolean;
  data?: AttendanceApiResponse[];
} | AttendanceApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  if (ref.firstName && ref.lastName) {
    return `${ref.firstName} ${ref.lastName}`;
  }
  return ref.name;
};

const normalizeAttendance = (item: AttendanceApiResponse): Attendance => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Attendance id is missing in API response");
  }

  return {
    id: String(normalizedId),
    enrollmentId: extractIdFromRef(item.enrollmentId),
    studentId: extractIdFromRef(item.studentId),
    studentName: extractNameFromRef(item.studentId),
    academicYearId: extractIdFromRef(item.academicYearId),
    academicYearName: extractNameFromRef(item.academicYearId),
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    sectionId: extractIdFromRef(item.sectionId),
    sectionName: extractNameFromRef(item.sectionId),
    date: item.date ?? "",
    status: (item.status as AttendanceStatus) ?? "Present",
    createdAt: item.createdAt,
  };
};

const extractAttendanceArray = (response: AttendanceListResponse): AttendanceApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const attendanceService = {
  // Get enrollments for attendance marking
  getEnrollments: async (filters: {
    academicYearId: string;
    classId: string;
    sectionId: string;
  }): Promise<Enrollment[]> => {
    const queryParams = new URLSearchParams(filters);
    const response = await apiClient.get<Enrollment[]>(`enrollments?${queryParams}`);
    return response;
  },

  // Get existing attendance for class on specific date
  getClassSummary: async (filters: {
    academicYearId: string;
    classId: string;
    sectionId: string;
    date: string;
  }): Promise<AttendanceSummary> => {
    const queryParams = new URLSearchParams(filters);
    const response = await apiClient.get<AttendanceSummary>(`attendance/class-summary?${queryParams}`);
    return response;
  },

  // Mark attendance for multiple students
  markAttendance: async (data: BulkAttendanceData): Promise<{ totalMarked: number }> => {
    const response = await apiClient.post<{ totalMarked: number }>("attendance/mark", data);
    return response;
  },

  // Get attendance dashboard data
  getDashboard: async (): Promise<{ summary: AttendanceSummary }> => {
    const response = await apiClient.get<{ summary: AttendanceSummary }>("attendance/dashboard");
    return response;
  },

  // Get attendance reports
  getReports: async (filters: {
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Attendance[]> => {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))
    );
    const response = await apiClient.get<Attendance[]>(`attendance/reports?${queryParams}`);
    return response;
  },

  // Legacy methods for backward compatibility
  getAll: async (): Promise<Attendance[]> => {
    const response = await apiClient.get<AttendanceListResponse>(API_ENDPOINTS.attendance.base);
    const attendanceArray = extractAttendanceArray(response);
    return attendanceArray
      .map((item) => {
        try {
          return normalizeAttendance(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Attendance => item !== null);
  },

  getById: async (id: string): Promise<Attendance> => {
    const response = await apiClient.get<AttendanceApiResponse>(API_ENDPOINTS.attendance.byId(id));
    return normalizeAttendance(response);
  },

  create: async (data: AttendanceData): Promise<Attendance> => {
    const response = await apiClient.post<AttendanceApiResponse>(API_ENDPOINTS.attendance.base, data);
    return normalizeAttendance(response);
  },

  update: async (id: string, data: Partial<AttendanceData>): Promise<Attendance> => {
    const response = await apiClient.patch<AttendanceApiResponse>(
      API_ENDPOINTS.attendance.byId(id),
      data
    );
    return normalizeAttendance(response);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.attendance.byId(id));
  },

  createBulk: async (data: BulkAttendanceData): Promise<Attendance[]> => {
    const response = await apiClient.post<AttendanceListResponse>(
      API_ENDPOINTS.attendance.bulk,
      data
    );
    const attendanceArray = extractAttendanceArray(response);
    return attendanceArray
      .map((item) => {
        try {
          return normalizeAttendance(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Attendance => item !== null);
  },
};
