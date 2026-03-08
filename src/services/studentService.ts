import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface StudentAdmissionData {
  _id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  address?: string;
  bloodGroup?: string;
  admissionDate: string;
  isActive: boolean;
  parentUserId?: {
    _id: string;
    name: string;
    email: string;
  };
  userId?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  schoolId: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  rollNumber?: number;
  createdAt: string;
  updatedAt: string;
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
    const response = await apiClient.post<StudentApiResponse>("admission", data);
    return normalizeStudent(response);
  },

  // Get all students with optional filters
  getAll: async (filters?: {
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
  }): Promise<Student[]> => {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters || {}).filter(([_, v]) => v !== undefined))
    );

    try {
      // Use admission API to get students
      const response = await apiClient.get<StudentAdmissionData[] | {success: boolean; data: StudentAdmissionData[]; pagination: any}>(`admission?${queryParams}`);
      
      // Handle both wrapped and direct array responses
      let studentsData: StudentAdmissionData[] = [];
      
      if (Array.isArray(response)) {
        // Direct array response
        studentsData = response;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        // Wrapped response
        studentsData = response.data;
      } else {
        console.error('Invalid API response structure:', response);
        return [];
      }
      
      return studentsData.map(student => ({
        id: student._id || '',
        name: `${student.firstName} ${student.lastName}`,
        email: student.userId?.email || '',
        admissionNumber: student.admissionNumber,
        dob: student.dateOfBirth,
        gender: student.gender.toLowerCase() as "male" | "female" | "other",
        parentId: student.parentUserId?._id || '',
        parentName: student.parentUserId?.name || '',
        academicYearId: student.academicYearId || '',
        classId: student.classId || '',
        sectionId: student.sectionId || '',
        rollNumber: student.rollNumber || 0,
        status: student.isActive ? 'active' : 'inactive' as const,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch from admission API:', error);
      throw new Error('Failed to fetch students from admission API');
    }
  },

  // Get students only from admission API (fallback)
  getAllFromAdmission: async (filters?: {
    academicYearId?: string;
    classId?: string;
    sectionId?: string;
  }): Promise<Student[]> => {
    const queryParams = new URLSearchParams(
      Object.fromEntries(Object.entries(filters || {}).filter(([_, v]) => v !== undefined))
    );

    try {
      const response = await apiClient.get<StudentAdmissionData[] | {success: boolean; data: StudentAdmissionData[]; pagination: any}>(`admission?${queryParams}`);
      
      // Handle both wrapped and direct array responses
      let studentsData: StudentAdmissionData[] = [];
      
      if (Array.isArray(response)) {
        // Direct array response
        studentsData = response;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        // Wrapped response
        studentsData = response.data;
      } else {
        console.error('Invalid API response structure:', response);
        return [];
      }
      
      return studentsData.map(student => ({
        id: student._id || '',
        name: `${student.firstName} ${student.lastName}`,
        email: student.userId?.email || '',
        admissionNumber: student.admissionNumber,
        dob: student.dateOfBirth,
        gender: student.gender.toLowerCase() as "male" | "female" | "other",
        parentId: student.parentUserId?._id || '',
        parentName: student.parentUserId?.name || '',
        academicYearId: student.academicYearId || '',
        classId: student.classId || '',
        sectionId: student.sectionId || '',
        rollNumber: student.rollNumber || 0,
        status: student.isActive ? 'active' : 'inactive' as const,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch from admission API:', error);
      throw new Error('Failed to fetch students from admission API');
    }
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
