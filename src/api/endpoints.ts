// Base URL must end with /api/v1 for versioned API
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://sms-backend-d19v.onrender.com/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "auth/login",
    register: "auth/register",
    refresh: "auth/refresh",
    logout: "auth/logout",
    logoutAll: "auth/logout-all",
    sessions: "auth/sessions",
    sessionById: (sessionId: string) => `auth/sessions/${sessionId}`,
  },
  dashboard: "dashboard",
  academicYears: {
    base: "academic-years",
    current: "academic-years/current",
    byId: (id: string) => `academic-years/${id}`,
    setCurrent: (id: string) => `academic-years/${id}/set-current`,
  },
  classes: {
    base: "classes",
    byId: (classId: string) => `classes/${classId}`,
  },
  sections: {
    base: "sections",
    byId: (sectionId: string) => `sections/${sectionId}`,
    byClassId: (classId: string) => `sections/class/${classId}`,
  },
  users: {
    base: "users",
    byId: (userId: string) => `users/${userId}`,
  },
  students: {
    base: "students",
    byId: (studentId: string) => `students/${studentId}`,
  },
  subjects: {
    base: "subjects",
    byId: (subjectId: string) => `subjects/${subjectId}`,
    byClassId: (classId: string) => `subjects/class/${classId}`,
  },
  exams: {
    base: "results/exams",
    byId: (examId: string) => `results/exams/${examId}`,
  },
  results: {
    base: "results/results",
    byId: (resultId: string) => `results/results/${resultId}`,
    byStudent: (studentId: string) => `results/results/student/${studentId}`,
  },
  teacherAssignments: {
    base: "teacher-assignments",
    byId: (id: string) => `teacher-assignments/${id}`,
    byTeacherId: (teacherId: string) => `teacher-assignments/teacher/${teacherId}`,
  },
  attendance: {
    base: "attendance",
    byId: (id: string) => `attendance/${id}`,
    bulk: "attendance/bulk",
  },
  classTeacher: {
    assign: "class-teacher/assign",
    base: "class-teacher",
    myClasses: "class-teacher/my-classes",
    check: (classId: string, sectionId: string) => `class-teacher/check/${classId}/${sectionId}`,
    byClass: (classId: string, sectionId: string) => `class-teacher/by-class/${classId}/${sectionId}`,
    byId: (id: string) => `class-teacher/${id}`,
  },
  fees: {
    structure: "fees/structure",
    assign: (studentId: string) => `fees/assign/${studentId}`,
    payment: (studentId: string) => `fees/payment/${studentId}`,
    student: (studentId: string) => `fees/student/${studentId}`,
  },
  reports: {
    reportCard: (studentId: string, examId: string) => `reports/report-card/${studentId}/${examId}`,
    reportCardView: (studentId: string, examId: string) => `reports/report-card/${studentId}/${examId}/view`,
    reportCardsBulk: "reports/report-cards/bulk",
    attendance: (studentId: string) => `reports/attendance/${studentId}`,
  },
  auditLogs: {
    base: "audit-logs",
    stats: "audit-logs/stats",
    user: (userId: string) => `audit-logs/user/${userId}`,
  },
  announcements: {
    base: "announcements",
  },
} as const;
