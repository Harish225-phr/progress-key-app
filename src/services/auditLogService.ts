import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface AuditLogEntry {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  userName: string;
  userRole: string;
  schoolId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuditLogListParams {
  page?: number;
  limit?: number;
  action?: string;
  resourceType?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  success?: boolean;
}

export interface AuditLogResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: AuditLogEntry[];
}

export const auditLogService = {
  getAllLogs: async (
    params?: AuditLogListParams
  ): Promise<AuditLogResponse> => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.action) search.set("action", params.action);
    if (params?.resourceType) search.set("resourceType", params.resourceType);
    if (params?.userId) search.set("userId", params.userId);
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    if (params?.success !== undefined) search.set("success", String(params.success));
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.getRaw(`${API_ENDPOINTS.auditLogs.base}${query}`);
  },

  getErrorLogs: async (
    params?: Omit<AuditLogListParams, 'success'>
  ): Promise<AuditLogResponse> => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.action) search.set("action", params.action);
    if (params?.resourceType) search.set("resourceType", params.resourceType);
    if (params?.userId) search.set("userId", params.userId);
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    search.set("success", "false");
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.getRaw(`${API_ENDPOINTS.auditLogs.base}${query}`);
  },

  getUserActivity: async (
    userId: string,
    params?: { page?: number; limit?: number; startDate?: string; endDate?: string }
  ): Promise<AuditLogResponse> => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.getRaw(`${API_ENDPOINTS.auditLogs.user(userId)}${query}`);
  },

  getSystemStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Record<string, unknown>> => {
    const search = new URLSearchParams();
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.get(`${API_ENDPOINTS.auditLogs.stats}${query}`);
  },

  getLogsByDateRange: async (
    startDate: string,
    endDate: string,
    params?: Omit<AuditLogListParams, 'startDate' | 'endDate'>
  ): Promise<AuditLogResponse> => {
    const search = new URLSearchParams();
    search.set("startDate", startDate);
    search.set("endDate", endDate);
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.action) search.set("action", params.action);
    if (params?.resourceType) search.set("resourceType", params.resourceType);
    if (params?.userId) search.set("userId", params.userId);
    if (params?.success !== undefined) search.set("success", String(params.success));
    const query = search.toString();
    return apiClient.getRaw(`${API_ENDPOINTS.auditLogs.base}?${query}`);
  },
};
