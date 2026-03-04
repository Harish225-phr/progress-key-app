  export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://sms-backend-d19v.onrender.com/api/v1";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  classes: {
    base: "/classes",
    byId: (classId: string) => `/classes/${classId}`,
  },
  sections: {
    base: "/sections",
    byId: (sectionId: string) => `/sections/${sectionId}`,
  },
  users: {
    base: "/users",
    byId: (userId: string) => `/users/${userId}`,
  },
} as const;
