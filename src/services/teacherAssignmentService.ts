import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface TeacherAssignmentData {
  teacherId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
}

export interface TeacherAssignment {
  id: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  subjectId: string;
  subjectName?: string;
  createdAt?: string;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
} | string;

type TeacherAssignmentApiResponse = {
  id?: string;
  _id?: string;
  teacherId?: PopulatedRef;
  classId?: PopulatedRef;
  sectionId?: PopulatedRef;
  subjectId?: PopulatedRef;
  createdAt?: string;
  updatedAt?: string;
};

type TeacherAssignmentsListResponse = {
  success?: boolean;
  data?: TeacherAssignmentApiResponse[];
} | TeacherAssignmentApiResponse[];

const extractIdFromRef = (ref: PopulatedRef | undefined): string => {
  if (!ref) return "";
  if (typeof ref === "string") return ref;
  return String(ref._id ?? ref.id ?? "");
};

const extractNameFromRef = (ref: PopulatedRef | undefined): string | undefined => {
  if (!ref || typeof ref === "string") return undefined;
  // Handle user/teacher name which might have firstName/lastName or just name
  if (ref.firstName && ref.lastName) {
    return `${ref.firstName} ${ref.lastName}`;
  }
  return ref.name;
};

const normalizeTeacherAssignment = (item: TeacherAssignmentApiResponse): TeacherAssignment => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("TeacherAssignment id is missing in API response");
  }

  return {
    id: String(normalizedId),
    teacherId: extractIdFromRef(item.teacherId),
    teacherName: extractNameFromRef(item.teacherId),
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    sectionId: extractIdFromRef(item.sectionId),
    sectionName: extractNameFromRef(item.sectionId),
    subjectId: extractIdFromRef(item.subjectId),
    subjectName: extractNameFromRef(item.subjectId),
    createdAt: item.createdAt,
  };
};

const extractAssignmentsArray = (response: TeacherAssignmentsListResponse): TeacherAssignmentApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const teacherAssignmentService = {
  getAll: async (): Promise<TeacherAssignment[]> => {
    const response = await apiClient.get<TeacherAssignmentsListResponse>(API_ENDPOINTS.teacherAssignments.base);
    const assignmentsArray = extractAssignmentsArray(response);
    return assignmentsArray
      .map((item) => {
        try {
          return normalizeTeacherAssignment(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is TeacherAssignment => item !== null);
  },

  getByTeacherId: async (teacherId: string): Promise<TeacherAssignment[]> => {
    const response = await apiClient.get<TeacherAssignmentsListResponse>(
      API_ENDPOINTS.teacherAssignments.byTeacherId(teacherId)
    );
    const assignmentsArray = extractAssignmentsArray(response);
    return assignmentsArray
      .map((item) => {
        try {
          return normalizeTeacherAssignment(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is TeacherAssignment => item !== null);
  },

  getById: async (id: string): Promise<TeacherAssignment> => {
    const response = await apiClient.get<TeacherAssignmentApiResponse>(
      API_ENDPOINTS.teacherAssignments.byId(id)
    );
    return normalizeTeacherAssignment(response);
  },

  create: async (data: TeacherAssignmentData): Promise<TeacherAssignment> => {
    const response = await apiClient.post<TeacherAssignmentApiResponse>(
      API_ENDPOINTS.teacherAssignments.base,
      data
    );
    return normalizeTeacherAssignment(response);
  },

  update: async (id: string, data: Partial<TeacherAssignmentData>): Promise<TeacherAssignment> => {
    const response = await apiClient.patch<TeacherAssignmentApiResponse>(
      API_ENDPOINTS.teacherAssignments.byId(id),
      data
    );
    return normalizeTeacherAssignment(response);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.teacherAssignments.byId(id));
  },
};
