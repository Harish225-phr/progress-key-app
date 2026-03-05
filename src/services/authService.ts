import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  schoolName: string;
  schoolEmail: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface AuthUser {
  role: string;
  full_name?: string;
  [key: string]: unknown;
}

interface LoginResponse {
  token?: string;
  user: AuthUser;
}

interface RegisterResponse {
  message?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, payload, {
    requiresAuth: false,
  });
};

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  return apiClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, payload, {
    requiresAuth: false,
  });
};
