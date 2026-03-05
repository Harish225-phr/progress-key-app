import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface SubjectData {
  name: string;
  classId: string;
}

export interface Subject {
  id: string;
  name: string;
  classId: string;
  className?: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
} | string;

type SubjectApiResponse = {
  id?: string;
  _id?: string;
  name?: string;
  classId?: PopulatedRef;
  createdAt?: string;
  updatedAt?: string;
};

type SubjectsListResponse = {
  success?: boolean;
  data?: SubjectApiResponse[];
} | SubjectApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
};

const normalizeSubject = (item: SubjectApiResponse): Subject => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Subject id is missing in API response");
  }

  return {
    id: String(normalizedId),
    name: item.name ?? "",
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    createdAt: item.createdAt,
  };
};

const extractSubjectsArray = (response: SubjectsListResponse): SubjectApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const subjectService = {
  getAll: async (): Promise<Subject[]> => {
    const response = await apiClient.get<SubjectsListResponse>(API_ENDPOINTS.subjects.base);
    const subjectsArray = extractSubjectsArray(response);
    return subjectsArray
      .map((item) => {
        try {
          return normalizeSubject(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Subject => item !== null);
  },

  getById: async (subjectId: string): Promise<Subject> => {
    const response = await apiClient.get<SubjectApiResponse>(API_ENDPOINTS.subjects.byId(subjectId));
    return normalizeSubject(response);
  },

  create: async (payload: SubjectData): Promise<Subject> => {
    const response = await apiClient.post<SubjectApiResponse>(API_ENDPOINTS.subjects.base, payload);
    return normalizeSubject(response);
  },

  update: async (subjectId: string, payload: Partial<SubjectData>): Promise<Subject> => {
    const response = await apiClient.patch<SubjectApiResponse>(API_ENDPOINTS.subjects.byId(subjectId), payload);
    return normalizeSubject(response);
  },

  delete: async (subjectId: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.subjects.byId(subjectId));
  },
};
