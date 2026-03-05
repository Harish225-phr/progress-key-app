import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSections: number;
}

export interface DashboardAttendance {
  totalMarked: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

export interface DashboardFees {
  totalFeesCollected: number;
  totalPendingFees: number;
}

export interface DashboardExams {
  totalExams: number;
  totalResultsEntered: number;
}

export interface DashboardData {
  stats: DashboardStats;
  attendance: DashboardAttendance;
  fees: DashboardFees;
  exams: DashboardExams;
}

type DashboardApiResponse = {
  success?: boolean;
  data?: DashboardData;
} | DashboardData;

const extractDashboardData = (response: DashboardApiResponse): DashboardData => {
  if ('data' in response && response.data) {
    return response.data;
  }
  return response as DashboardData;
};

export const dashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardApiResponse>(API_ENDPOINTS.dashboard);
    return extractDashboardData(response);
  },
};
