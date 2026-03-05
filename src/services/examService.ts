import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ExamData {
  name: string;
  classId: string;
  academicYear: string;
  examDate: string;
}

export interface Exam {
  id: string;
  name: string;
  classId: string;
  className?: string;
  academicYear: string;
  examDate: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
} | string;

type ExamApiResponse = {
  id?: string;
  _id?: string;
  name?: string;
  classId?: PopulatedRef;
  academicYear?: string;
  examDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ExamsListResponse = {
  success?: boolean;
  data?: ExamApiResponse[];
} | ExamApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
};

const normalizeExam = (item: ExamApiResponse): Exam => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Exam id is missing in API response");
  }

  return {
    id: String(normalizedId),
    name: item.name ?? "",
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    academicYear: item.academicYear ?? "",
    examDate: item.examDate ?? "",
    createdAt: item.createdAt,
  };
};

const extractExamsArray = (response: ExamsListResponse): ExamApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const response = await apiClient.get<ExamsListResponse>(API_ENDPOINTS.exams.base);
    const examsArray = extractExamsArray(response);
    return examsArray
      .map((item) => {
        try {
          return normalizeExam(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Exam => item !== null);
  },

  getById: async (examId: string): Promise<Exam> => {
    const response = await apiClient.get<ExamApiResponse>(API_ENDPOINTS.exams.byId(examId));
    return normalizeExam(response);
  },

  create: async (payload: ExamData): Promise<Exam> => {
    const response = await apiClient.post<ExamApiResponse>(API_ENDPOINTS.exams.base, payload);
    return normalizeExam(response);
  },

  update: async (examId: string, payload: Partial<ExamData>): Promise<Exam> => {
    const response = await apiClient.patch<ExamApiResponse>(API_ENDPOINTS.exams.byId(examId), payload);
    return normalizeExam(response);
  },

  delete: async (examId: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.exams.byId(examId));
  },
};
