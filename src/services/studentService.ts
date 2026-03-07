import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface StudentAdmissionData {
  name: string;
  email: string;
  password: string;
  admissionNumber: string;
  dob: string;
  gender: "male" | "female" | "other";
  parentId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  rollNumber: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  admissionNumber: string;
  dob: string;
  gender: "male" | "female" | "other";
  parentId: string;
  parentName?: string;
  academicYearId: string;
  academicYearName?: string;
  classId: string;
  className?: string;
  sectionId: string;
  sectionName?: string;
  rollNumber: number;
  status: "active" | "inactive" | "graduated" | "transferred";
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentProfile extends Student {
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  results: ExamResult[];
  feeRecords: FeeRecord[];
}

export interface Enrollment {
  id: string;
  academicYearId: string;
  academicYearName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  rollNumber: number;
  enrollmentDate: string;
  status: "active" | "completed" | "withdrawn";
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late" | "leave";
  subject?: string;
  remarks?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examName: string;
  subjectId: string;
  subjectName: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  examDate: string;
}

export interface FeeRecord {
  id: string;
  feeStructureId: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue" | "partial";
  paidAmount?: number;
}

type PopulatedRef = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
} | string;

type StudentApiResponse = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  admissionNumber?: string;
  dob?: string;
  gender?: string;
  parentId?: PopulatedRef;
  academicYearId?: PopulatedRef;
  classId?: PopulatedRef;
  sectionId?: PopulatedRef;
  rollNumber?: number;
  status?: string;
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
    name: item.name ?? "",
    email: item.email ?? "",
    admissionNumber: item.admissionNumber ?? "",
    dob: item.dob ?? "",
    gender: (item.gender as "male" | "female" | "other") ?? "other",
    parentId: extractIdFromRef(item.parentId),
    parentName: extractNameFromRef(item.parentId),
    academicYearId: extractIdFromRef(item.academicYearId),
    academicYearName: extractNameFromRef(item.academicYearId),
    classId: extractIdFromRef(item.classId),
    className: extractNameFromRef(item.classId),
    sectionId: extractIdFromRef(item.sectionId),
    sectionName: extractNameFromRef(item.sectionId),
    rollNumber: item.rollNumber ?? 0,
    status: (item.status as "active" | "inactive" | "graduated" | "transferred") ?? "active",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
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
  // Student Admission
  admitStudent: async (data: StudentAdmissionData): Promise<Student> => {
    const response = await apiClient.post<StudentApiResponse>("students/admission", data);
    return normalizeStudent(response);
  },

  // Get all students with optional filters
  getAll: async (filters?: {
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
  }): Promise<Student[]> => {
    const queryParams = new URLSearchParams();
    if (filters?.academicYearId) queryParams.append("academicYearId", filters.academicYearId);
    if (filters?.classId) queryParams.append("classId", filters.classId);
    if (filters?.sectionId) queryParams.append("sectionId", filters.sectionId);
    
    const endpoint = queryParams.toString() 
      ? `${API_ENDPOINTS.students.base}?${queryParams.toString()}`
      : API_ENDPOINTS.students.base;
    
    const response = await apiClient.get<StudentsListResponse>(endpoint);
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

  // Get student by ID
  getById: async (studentId: string): Promise<Student> => {
    const response = await apiClient.get<StudentApiResponse>(API_ENDPOINTS.students.byId(studentId));
    return normalizeStudent(response);
  },

  // Get student profile with all details
  getProfile: async (studentId: string): Promise<StudentProfile> => {
    const response = await apiClient.get<StudentProfile>(`students/profile/${studentId}`);
    return response;
  },

  // Update student
  update: async (studentId: string, data: Partial<Omit<StudentAdmissionData, "password" | "admissionNumber">>): Promise<Student> => {
    const response = await apiClient.patch<StudentApiResponse>(API_ENDPOINTS.students.byId(studentId), data);
    return normalizeStudent(response);
  },

  // Delete student
  delete: async (studentId: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.students.byId(studentId));
  },

  // Update enrollment
  updateEnrollment: async (studentId: string, data: {
    academicYearId: string;
    classId: string;
    sectionId: string;
    rollNumber: number;
  }): Promise<Student> => {
    const response = await apiClient.patch<StudentApiResponse>(`students/${studentId}/enrollment`, data);
    return normalizeStudent(response);
  },
};
