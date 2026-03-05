  export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://sms-backend-d19v.onrender.com/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  dashboard: "/dashboard",
  classes: {
    base: "/classes",
    byId: (classId: string) => `/classes/${classId}`,
  },
  sections: {
    base: "/sections",
    byId: (sectionId: string) => `/sections/${sectionId}`,
    byClassId: (classId: string) => `/sections/class/${classId}`,
  },
  users: {
    base: "/users",
    byId: (userId: string) => `/users/${userId}`,
  },
  students: {
    base: "/students",
    byId: (studentId: string) => `/students/${studentId}`,
  },
  subjects: {
    base: "/subjects",
    byId: (subjectId: string) => `/subjects/${subjectId}`,
    byClassId: (classId: string) => `/subjects/class/${classId}`,
  },
  exams: {
    base: "/results/exams",
    byId: (examId: string) => `/results/exams/${examId}`,
  },
  results: {
    base: "/results/results",
    byId: (resultId: string) => `/results/results/${resultId}`,
  },
  teacherAssignments: {
    base: "/teacher-assignments",
    byId: (id: string) => `/teacher-assignments/${id}`,
    byTeacherId: (teacherId: string) => `/teacher-assignments/teacher/${teacherId}`,
  },
  attendance: {
    base: "/attendance",
    byId: (id: string) => `/attendance/${id}`,
    bulk: "/attendance/bulk",
  },
} as const;
