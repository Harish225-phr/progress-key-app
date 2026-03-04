import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const userService = {
  getAll: () => apiClient.get<User[]>(API_ENDPOINTS.users.base),

  getById: (userId: string) =>
    apiClient.get<User>(API_ENDPOINTS.users.byId(userId)),

  create: (payload: CreateUserPayload) =>
    apiClient.post<User>(API_ENDPOINTS.users.base, payload),

  update: (userId: string, payload: Partial<CreateUserPayload>) =>
    apiClient.put<User>(API_ENDPOINTS.users.byId(userId), payload),

  delete: (userId: string) =>
    apiClient.delete<void>(API_ENDPOINTS.users.byId(userId)),
};
