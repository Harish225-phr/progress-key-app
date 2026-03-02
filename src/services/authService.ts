import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

interface LoginPayload {
  email: string;
  password: string;
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

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  return apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, payload, {
    requiresAuth: false,
  });
};
