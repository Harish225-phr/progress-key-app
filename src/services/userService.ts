import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
  schoolId?: string;
  created_at?: string;
}

type UserApiResponse = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  schoolId?: string;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
};

type UsersListResponse = {
  success?: boolean;
  data?: UserApiResponse[];
} | UserApiResponse[];

type SingleUserResponse = {
  success?: boolean;
  data?: UserApiResponse;
} | UserApiResponse;

const normalizeUser = (item: UserApiResponse): User => {
  const normalizedId = item.id ?? item._id;

  if (!normalizedId) {
    throw new Error("User id is missing in API response");
  }

  return {
    id: String(normalizedId),
    name: item.name ?? "",
    email: item.email ?? "",
    role: item.role ?? "",
    isActive: item.isActive,
    schoolId: item.schoolId,
    created_at: item.created_at ?? item.createdAt,
  };
};

const extractUsersArray = (response: UsersListResponse): UserApiResponse[] => {
  if (Array.isArray(response)) {
    return response;
  }
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

const extractSingleUser = (response: SingleUserResponse): UserApiResponse => {
  if ('data' in response && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
    return response.data;
  }
  return response as UserApiResponse;
};

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<UsersListResponse>(API_ENDPOINTS.users.base);
    const usersArray = extractUsersArray(response);
    return usersArray
      .map((item) => {
        try {
          return normalizeUser(item);
        } catch {
          return null;
        }
      })
      .filter((item): item is User => item !== null);
  },

  getById: async (userId: string): Promise<User> => {
    const response = await apiClient.get<SingleUserResponse>(API_ENDPOINTS.users.byId(userId));
    return normalizeUser(extractSingleUser(response));
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const response = await apiClient.post<SingleUserResponse>(API_ENDPOINTS.users.base, payload);
    return normalizeUser(extractSingleUser(response));
  },

  update: async (userId: string, payload: Partial<CreateUserPayload>): Promise<User> => {
    const response = await apiClient.put<SingleUserResponse>(API_ENDPOINTS.users.byId(userId), payload);
    return normalizeUser(extractSingleUser(response));
  },

  delete: (userId: string) =>
    apiClient.delete<void>(API_ENDPOINTS.users.byId(userId)),
};
