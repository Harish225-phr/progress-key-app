import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ResultData {
  studentId: string;
  examId: string;
  subjectId: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  remarks?: string;
}

export interface Result {
  id: string;
  studentId: string;
  studentName?: string;
  examId: string;
  examName?: string;
  subjectId: string;
  subjectName?: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
} | string;

type ResultApiResponse = {
  id?: string;
  _id?: string;
  studentId?: PopulatedRef;
  examId?: PopulatedRef;
  subjectId?: PopulatedRef;
  marksObtained?: number;
  maxMarks?: number;
  grade?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ResultsListResponse = {
  success?: boolean;
  data?: ResultApiResponse[];
} | ResultApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  // Handle student name which might have firstName/lastName
  if (ref.firstName && ref.lastName) {
    return `${ref.firstName} ${ref.lastName}`;
  }
  return ref.name;
};

const normalizeResult = (item: ResultApiResponse): Result => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Result id is missing in API response");
  }

  return {
    id: String(normalizedId),
    studentId: extractIdFromRef(item.studentId),
    studentName: extractNameFromRef(item.studentId),
    examId: extractIdFromRef(item.examId),
    examName: extractNameFromRef(item.examId),
    subjectId: extractIdFromRef(item.subjectId),
    subjectName: extractNameFromRef(item.subjectId),
    marksObtained: item.marksObtained ?? 0,
    maxMarks: item.maxMarks ?? 0,
    grade: item.grade ?? "",
    remarks: item.remarks ?? "",
    createdAt: item.createdAt,
  };
};

const extractResultsArray = (response: ResultsListResponse): ResultApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const resultService = {
  getAll: async (): Promise<Result[]> => {
    const response = await apiClient.get<ResultsListResponse>(API_ENDPOINTS.results.base);
    const resultsArray = extractResultsArray(response);
    return resultsArray
      .map((item) => {
        try {
          return normalizeResult(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Result => item !== null);
  },

  getById: async (resultId: string): Promise<Result> => {
    const response = await apiClient.get<ResultApiResponse>(API_ENDPOINTS.results.byId(resultId));
    return normalizeResult(response);
  },

  create: async (data: ResultData): Promise<Result> => {
    const response = await apiClient.post<ResultApiResponse>(API_ENDPOINTS.results.base, data);
    return normalizeResult(response);
  },

  update: async (resultId: string, data: Partial<ResultData>): Promise<Result> => {
    const response = await apiClient.patch<ResultApiResponse>(
      API_ENDPOINTS.results.byId(resultId),
      data
    );
    return normalizeResult(response);
  },

  delete: async (resultId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.results.byId(resultId));
  },
};
