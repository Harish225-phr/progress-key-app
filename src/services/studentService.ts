import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface StudentData {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  classId: string;
  sectionId: string;
  parentName: string;
  parentPhone: string;
  address: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  parentName: string;
  parentPhone: string;
  address: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
} | string;

type StudentApiResponse = {
  id?: string;
  _id?: string;
  admissionNumber?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;
  classId?: PopulatedRef;
  sectionId?: PopulatedRef;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

type StudentsListResponse = {
  success?: boolean;
  data?: StudentApiResponse[];
} | StudentApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
};

const normalizeStudent = (item: StudentApiResponse): Student => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("Student id is missing in API response");
  }

  return {
    id: String(normalizedId),
    admissionNumber: item.admissionNumber ?? "",
    firstName: item.firstName ?? "",
    lastName: item.lastName ?? "",
    gender: item.gender ?? "",
    dateOfBirth: item.dateOfBirth ?? "",
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    sectionId: extractIdFromRef(item.sectionId),
    sectionName: extractNameFromRef(item.sectionId),
    parentName: item.parentName ?? "",
    parentPhone: item.parentPhone ?? "",
    address: item.address ?? "",
    createdAt: item.createdAt,
  };
};

const extractStudentsArray = (response: StudentsListResponse): StudentApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const studentService = {
  getAll: async (): Promise<Student[]> => {
    const response = await apiClient.get<StudentsListResponse>(API_ENDPOINTS.students.base);
    const studentsArray = extractStudentsArray(response);
    return studentsArray
      .map((item) => {
        try {
          return normalizeStudent(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is Student => item !== null);
  },

  getById: async (studentId: string): Promise<Student> => {
    const response = await apiClient.get<StudentApiResponse>(API_ENDPOINTS.students.byId(studentId));
    return normalizeStudent(response);
  },

  create: async (payload: StudentData): Promise<Student> => {
    const response = await apiClient.post<StudentApiResponse>(API_ENDPOINTS.students.base, payload);
    return normalizeStudent(response);
  },

  update: async (studentId: string, payload: Partial<StudentData>): Promise<Student> => {
    const response = await apiClient.patch<StudentApiResponse>(API_ENDPOINTS.students.byId(studentId), payload);
    return normalizeStudent(response);
  },

  delete: async (studentId: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.students.byId(studentId));
  },
};
