export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://sms-backend-d19v.onrender.com/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
  },
  classes: {
    base: "/classes",
    byId: (classId: string) => `/classes/${classId}`,
  },
} as const;
