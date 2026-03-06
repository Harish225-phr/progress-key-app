import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getCached, setCached, clearCache } from "./cache";

export interface Term {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface Holiday {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface AcademicYearSettings {
  workingDays?: string[];
  gradingSystem?: string;
}

export interface AcademicYear {
  id: string;
  name?: string;
  schoolId?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  isActive?: boolean;
  terms?: Term[];
  holidays?: Holiday[];
  settings?: AcademicYearSettings;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/** API response wrapper type from backend */
interface ApiResponse<T> {
  success?: boolean;
  count?: number;
  data?: T;
  message?: string;
}

// Cache key constants
const CACHE_KEYS = {
  ALL_ACADEMIC_YEARS: "academicYears:all",
  CURRENT_ACADEMIC_YEAR: "academicYears:current",
} as const;

/** Map MongoDB _id to id */
const mapAcademicYear = (item: Record<string, unknown>): AcademicYear => {
  const { _id, ...rest } = item;
  return {
    id: String(_id ?? item.id ?? ""),
    ...rest,
  } as AcademicYear;
};

export const academicYearService = {
  /** List academic years for the school (with caching) */
  getList: async (params?: { isActive?: boolean }): Promise<AcademicYear[]> => {
    // Build cache key based on params
    const cacheKey = params?.isActive 
      ? `${CACHE_KEYS.ALL_ACADEMIC_YEARS}:active` 
      : CACHE_KEYS.ALL_ACADEMIC_YEARS;

    // Check cache first
    const cached = getCached<AcademicYear[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) {
      queryParams.set('isActive', String(params.isActive));
    }
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.academicYears.base}?${queryString}` 
      : API_ENDPOINTS.academicYears.base;

    const response = await apiClient.get<ApiResponse<AcademicYear[]>>(endpoint);
    const data = response?.data ?? response;
    let years: AcademicYear[] = [];
    
    if (Array.isArray(data)) {
      years = data.map((item) => {
        if (typeof item === "object" && item !== null && "_id" in item) {
          return mapAcademicYear(item as Record<string, unknown>);
        }
        return item;
      });
    }

    // Cache the result
    setCached(cacheKey, years);
    return years;
  },

  /** Get current academic year (with caching) */
  getCurrent: async (): Promise<AcademicYear | null> => {
    // Check cache first
    const cached = getCached<AcademicYear>(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    if (cached) {
      return cached;
    }

    try {
      const response = await apiClient.get<ApiResponse<AcademicYear>>(
        API_ENDPOINTS.academicYears.current
      );
      const data = response?.data ?? response;
      let year: AcademicYear | null = null;
      
      if (data && typeof data === "object" && "id" in data) {
        year = data as AcademicYear;
      }
      if (data && typeof data === "object" && "_id" in data) {
        year = mapAcademicYear(data as Record<string, unknown>);
      }

      // Cache the result
      if (year) {
        setCached(CACHE_KEYS.CURRENT_ACADEMIC_YEAR, year);
      }
      return year;
    } catch {
      return null;
    }
  },

  /** Create academic year (school_admin) */
  create: async (payload: {
    name: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
    terms?: Term[];
    holidays?: Holiday[];
    settings?: AcademicYearSettings;
  }): Promise<AcademicYear> => {
    const response = await apiClient.post<ApiResponse<AcademicYear>>(API_ENDPOINTS.academicYears.base, payload);
    const data = response?.data ?? response;
    let year: AcademicYear;
    
    if (data && typeof data === "object" && "_id" in data) {
      year = mapAcademicYear(data as Record<string, unknown>);
    } else {
      year = data as AcademicYear;
    }

    // Clear cache since list changed
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    return year;
  },

  /** Update academic year */
  update: async (id: string, payload: Partial<{
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    description: string;
    settings: AcademicYearSettings;
  }>): Promise<AcademicYear> => {
    const response = await apiClient.put<ApiResponse<AcademicYear>>(
      API_ENDPOINTS.academicYears.byId(id), 
      payload
    );
    const data = response?.data ?? response;
    let year: AcademicYear;
    
    if (data && typeof data === "object" && "_id" in data) {
      year = mapAcademicYear(data as Record<string, unknown>);
    } else {
      year = data as AcademicYear;
    }

    // Clear cache since list changed
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    return year;
  },

  /** Set as current academic year */
  setCurrent: async (id: string): Promise<AcademicYear> => {
    const response = await apiClient.put<ApiResponse<AcademicYear>>(
      API_ENDPOINTS.academicYears.setCurrent(id)
    );
    const data = response?.data ?? response;
    let year: AcademicYear;
    
    if (data && typeof data === "object" && "_id" in data) {
      year = mapAcademicYear(data as Record<string, unknown>);
    } else {
      year = data as AcademicYear;
    }

    // Clear cache since current year changed
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    return year;
  },

  /** Delete academic year (soft delete) */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.academicYears.byId(id));
    // Clear cache since list changed
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
  },

  /** Add term to academic year */
  addTerm: async (id: string, term: Term): Promise<AcademicYear> => {
    const response = await apiClient.post<ApiResponse<AcademicYear>>(
      `${API_ENDPOINTS.academicYears.byId(id)}/terms`,
      term
    );
    const data = response?.data ?? response;
    let year: AcademicYear;
    
    if (data && typeof data === "object" && "_id" in data) {
      year = mapAcademicYear(data as Record<string, unknown>);
    } else {
      year = data as AcademicYear;
    }

    // Clear cache
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    return year;
  },

  /** Add holiday to academic year */
  addHoliday: async (id: string, holiday: Holiday): Promise<AcademicYear> => {
    const response = await apiClient.post<ApiResponse<AcademicYear>>(
      `${API_ENDPOINTS.academicYears.byId(id)}/holidays`,
      holiday
    );
    const data = response?.data ?? response;
    let year: AcademicYear;
    
    if (data && typeof data === "object" && "_id" in data) {
      year = mapAcademicYear(data as Record<string, unknown>);
    } else {
      year = data as AcademicYear;
    }

    // Clear cache
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
    return year;
  },

  /** Force refresh cache */
  refreshCache: async (): Promise<void> => {
    clearCache(CACHE_KEYS.ALL_ACADEMIC_YEARS);
    clearCache(CACHE_KEYS.CURRENT_ACADEMIC_YEAR);
  },
};
