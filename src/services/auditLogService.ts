import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface AuditLogEntry {
  id: string;
  action?: string;
  resourceType?: string;
  userId?: string;
  success?: boolean;
  createdAt?: string;
  [key: string]: unknown;
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

export const auditLogService = {
  list: async (
    params?: AuditLogListParams
  ): Promise<{ data?: AuditLogEntry[]; total?: number }> => {
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
    return apiClient.get(`${API_ENDPOINTS.auditLogs.base}${query}`);
  },

  stats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<Record<string, unknown>> => {
    const search = new URLSearchParams();
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.get(`${API_ENDPOINTS.auditLogs.stats}${query}`);
  },

  getUserActivity: async (
    userId: string,
    params?: { page?: number; limit?: number; startDate?: string; endDate?: string }
  ): Promise<{ data?: AuditLogEntry[] }> => {
    const search = new URLSearchParams();
    if (params?.page != null) search.set("page", String(params.page));
    if (params?.limit != null) search.set("limit", String(params.limit));
    if (params?.startDate) search.set("startDate", params.startDate);
    if (params?.endDate) search.set("endDate", params.endDate);
    const query = search.toString() ? `?${search.toString()}` : "";
    return apiClient.get(`${API_ENDPOINTS.auditLogs.user(userId)}${query}`);
  },
};
