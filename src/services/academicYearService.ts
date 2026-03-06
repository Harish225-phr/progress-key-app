import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface AcademicYear {
  id: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  [key: string]: unknown;
}

/** API response wrapper type from backend */
interface ApiResponse<T> {
  success?: boolean;
  count?: number;
  data?: T;
  message?: string;
}

/** Map MongoDB _id to id */
const mapAcademicYear = (item: Record<string, unknown>): AcademicYear => {
  const { _id, ...rest } = item;
  return {
    id: String(_id ?? item.id ?? ""),
    ...rest,
  } as AcademicYear;
};

export const academicYearService = {
  /** List academic years for the school */
  getList: async (): Promise<AcademicYear[]> => {
    const response = await apiClient.get<ApiResponse<AcademicYear[]>>(
      API_ENDPOINTS.academicYears.base
    );
    const data = response?.data ?? response;
    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === "object" && item !== null && "_id" in item) {
          return mapAcademicYear(item as Record<string, unknown>);
        }
        return item;
      });
    }
    return [];
  },

  /** Get current academic year. 404 or empty when none set. */
  getCurrent: async (): Promise<AcademicYear | null> => {
    try {
      const response = await apiClient.get<ApiResponse<AcademicYear>>(
        API_ENDPOINTS.academicYears.current
      );
      const data = response?.data ?? response;
      if (data && typeof data === "object" && "id" in data) {
        return data as AcademicYear;
      }
      if (data && typeof data === "object" && "_id" in data) {
        return mapAcademicYear(data as Record<string, unknown>);
      }
      return null;
    } catch {
      return null;
    }
  },

  /** Create academic year (school_admin) */
  create: async (payload: { name: string; startDate?: string; endDate?: string }): Promise<AcademicYear> => {
    const response = await apiClient.post<ApiResponse<AcademicYear>>(API_ENDPOINTS.academicYears.base, payload);
    const data = response?.data ?? response;
    if (data && typeof data === "object" && "_id" in data) {
      return mapAcademicYear(data as Record<string, unknown>);
    }
    return data as AcademicYear;
  },

  /** Set as current academic year */
  setCurrent: async (id: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.academicYears.setCurrent(id), undefined);
  },
};
