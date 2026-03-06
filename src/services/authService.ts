import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_KEY = "token";
const USER_KEY = "user";

export interface AuthUser {
  id: string;
  name?: string;
  full_name?: string;
  email: string;
  role: string;
  schoolId?: string;
  [key: string]: unknown;
}

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

/** Login response: backend returns { success, data: { accessToken, refreshToken, token?, user } } */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  token?: string;
  user: AuthUser;
}

interface RegisterResponse {
  message?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

export interface Session {
  id: string;
  userAgent?: string;
  ip?: string;
  lastActiveAt?: string;
  createdAt?: string;
}

/** Store tokens and user after login. Use accessToken for Authorization header. */
export function setAuthTokens(data: {
  accessToken: string;
  refreshToken: string;
  token?: string;
  user: AuthUser;
}) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  if (data.token) sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

/** Clear all auth data (logout). */
export function clearAuthTokens() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, payload, {
    requiresAuth: false,
  });
  // Backend may return { data: { accessToken, refreshToken, token, user } }; client unwraps data
  const data = response as LoginResponse;
  if (data.accessToken && data.refreshToken && data.user) {
    return data;
  }
  // Legacy shape: { token, user }
  const legacy = response as { token?: string; user?: AuthUser };
  if (legacy.token && legacy.user) {
    return {
      accessToken: legacy.token,
      refreshToken: legacy.token,
      token: legacy.token,
      user: legacy.user,
    };
  }
  throw new Error("Invalid login response");
};

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  return apiClient.post<RegisterResponse>(API_ENDPOINTS.auth.register, payload, {
    requiresAuth: false,
  });
};

/** Refresh tokens. Call on 401; updates stored tokens on success. */
export const refreshToken = async (): Promise<void> => {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearAuthTokens();
    throw new Error("No refresh token");
  }
  const response = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
    token?: string;
  }>(API_ENDPOINTS.auth.refresh, { refreshToken: refresh }, { requiresAuth: false });
  sessionStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
  sessionStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  if (response.token) sessionStorage.setItem(TOKEN_KEY, response.token);
};

/** Logout: send refreshToken so backend can revoke session, then clear storage. */
export const logout = async (): Promise<void> => {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await apiClient.post(API_ENDPOINTS.auth.logout, { refreshToken: refresh }, { requiresAuth: false });
    }
  } finally {
    clearAuthTokens();
  }
};

/** Logout from all devices. Requires Authorization. Clears storage after. */
export const logoutAll = async (): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.auth.logoutAll);
  } finally {
    clearAuthTokens();
  }
};

/** List active sessions (for "My devices"). */
export const getSessions = async (): Promise<Session[]> => {
  const response = await apiClient.get<{ data?: Session[] } | Session[]>(API_ENDPOINTS.auth.sessions);
  if (Array.isArray(response)) return response;
  return (response as { data?: Session[] }).data ?? [];
};

/** Revoke a session by ID. */
export const revokeSession = async (sessionId: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.auth.sessionById(sessionId));
};
