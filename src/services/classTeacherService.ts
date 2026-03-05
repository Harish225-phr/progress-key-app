import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface ClassTeacherAssignment {
  id: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  academicYear: string;
  createdAt?: string;
}

export interface AssignClassTeacherData {
  teacherId: string;
  classId: string;
  sectionId: string;
  academicYear: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
} | string;

type ClassTeacherApiResponse = {
  id?: string;
  _id?: string;
  teacherId?: PopulatedRef;
  classId?: PopulatedRef;
  sectionId?: PopulatedRef;
  academicYear?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ClassTeacherListResponse = {
  success?: boolean;
  data?: ClassTeacherApiResponse[];
} | ClassTeacherApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  return ref.name;
};

const normalizeAssignment = (item: ClassTeacherApiResponse): ClassTeacherAssignment => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("ClassTeacherAssignment id is missing in API response");
  }

  return {
    id: String(normalizedId),
    teacherId: extractIdFromRef(item.teacherId),
    teacherName: extractNameFromRef(item.teacherId),
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    sectionId: extractIdFromRef(item.sectionId),
    sectionName: extractNameFromRef(item.sectionId),
    academicYear: item.academicYear ?? "",
    createdAt: item.createdAt,
  };
};

const extractAssignmentsArray = (response: ClassTeacherListResponse): ClassTeacherApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const classTeacherService = {
  // Get all class teacher assignments (admin)
  getAll: async (): Promise<ClassTeacherAssignment[]> => {
    const response = await apiClient.get<ClassTeacherListResponse>(API_ENDPOINTS.classTeacher.base);
    const assignmentsArray = extractAssignmentsArray(response);
    return assignmentsArray
      .map((item) => {
        try {
          return normalizeAssignment(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is ClassTeacherAssignment => item !== null);
  },

  // Get current teacher's assigned classes (teacher)
  getMyClasses: async (): Promise<ClassTeacherAssignment[]> => {
    const response = await apiClient.get<ClassTeacherListResponse>(API_ENDPOINTS.classTeacher.myClasses);
    const assignmentsArray = extractAssignmentsArray(response);
    return assignmentsArray
      .map((item) => {
        try {
          return normalizeAssignment(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is ClassTeacherAssignment => item !== null);
  },

  // Check if teacher is class teacher for specific class/section
  checkClassTeacher: async (classId: string, sectionId: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ isClassTeacher?: boolean }>(
        API_ENDPOINTS.classTeacher.check(classId, sectionId)
      );
      return response?.isClassTeacher ?? false;
    } catch {
      return false;
    }
  },

  // Assign a teacher as class teacher (admin only)
  assign: async (data: AssignClassTeacherData): Promise<ClassTeacherAssignment> => {
    const response = await apiClient.post<ClassTeacherApiResponse>(
      API_ENDPOINTS.classTeacher.assign,
      data
    );
    return normalizeAssignment(response);
  },
};
