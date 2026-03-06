import { ApiError, RetryRequestError } from "@/api/errors";
import { API_BASE_URL } from "@/api/endpoints";

const AUTH_REFRESH_PATH = "auth/refresh";

/** Use accessToken for Authorization; fallback to legacy "token" */
export const getAccessToken = (): string | null =>
  sessionStorage.getItem("accessToken") ?? sessionStorage.getItem("token");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiRequestConfig = Omit<RequestInit, "method" | "body" | "headers"> & {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  requiresAuth?: boolean;
};

type ApiRequestContext = {
  url: string;
  endpoint: string;
  config: ApiRequestConfig;
};

type RequestInterceptor = (
  context: ApiRequestContext,
) => Promise<ApiRequestContext> | ApiRequestContext;

type ResponseInterceptor = (
  response: Response,
  context: ApiRequestContext,
) => Promise<Response> | Response;

type ErrorInterceptor = (
  error: ApiError,
  context: ApiRequestContext,
) => Promise<ApiError> | ApiError;

const requestInterceptors: RequestInterceptor[] = [];
const responseInterceptors: ResponseInterceptor[] = [];
const errorInterceptors: ErrorInterceptor[] = [];

const normalizePath = (endpoint: string) => endpoint.replace(/^\/+/, "");

const safeParseResponseBody = async (response: Response) => {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const toApiError = (error: unknown, defaultMessage = "Request failed") => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError(defaultMessage, 0);
};

const defaultRequestInterceptor: RequestInterceptor = (context) => {
  const { config } = context;
  const nextHeaders = new Headers(config.headers);

  if (!nextHeaders.has("Content-Type") && config.body !== undefined) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (!nextHeaders.has("Accept")) {
    nextHeaders.set("Accept", "application/json");
  }

  if (config.requiresAuth !== false) {
    const token = getAccessToken();
    if (token && !nextHeaders.has("Authorization")) {
      nextHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  return {
    ...context,
    config: {
      ...config,
      headers: nextHeaders,
    },
  };
};

requestInterceptors.push(defaultRequestInterceptor);

const applyRequestInterceptors = async (context: ApiRequestContext) => {
  let nextContext = context;
  for (const interceptor of requestInterceptors) {
    nextContext = await interceptor(nextContext);
  }
  return nextContext;
};

const applyResponseInterceptors = async (response: Response, context: ApiRequestContext) => {
  let nextResponse = response;
  for (const interceptor of responseInterceptors) {
    nextResponse = await interceptor(nextResponse, context);
  }
  return nextResponse;
};

const applyErrorInterceptors = async (error: ApiError, context: ApiRequestContext) => {
  let nextError = error;
  for (const interceptor of errorInterceptors) {
    nextError = await interceptor(nextError, context);
  }
  return nextError;
};

const unwrapApiResponse = <T>(payload: unknown): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
};

let onRefreshFailure: (() => void) | null = null;
/** Call this (e.g. from auth module) to redirect to login when refresh fails */
export const setOnRefreshFailure = (fn: () => void) => {
  onRefreshFailure = fn;
};

let refreshTokenFn: (() => Promise<void>) | null = null;
/** Set the function that refreshes tokens (e.g. authService.refreshToken). Called on 401 before retry. */
export const setRefreshTokenFn = (fn: () => Promise<void>) => {
  refreshTokenFn = fn;
};

const isRefreshRequest = (url: string) =>
  url.includes(AUTH_REFRESH_PATH) || url.endsWith("/auth/refresh");

const authErrorInterceptor: ErrorInterceptor = async (error, context) => {
  if (error.status !== 401 || isRefreshRequest(context.url)) {
    return error;
  }
  if (!refreshTokenFn) {
    onRefreshFailure?.();
    return error;
  }
  try {
    await refreshTokenFn();
    throw new RetryRequestError();
  } catch (e) {
    if (e instanceof RetryRequestError) throw e;
    onRefreshFailure?.();
    return error;
  }
};
errorInterceptors.push(authErrorInterceptor);

const request = async <T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> => {
  const normalizedEndpoint = normalizePath(endpoint);
  const initialContext: ApiRequestContext = {
    url: `${API_BASE_URL}/${normalizedEndpoint}`,
    endpoint: normalizedEndpoint,
    config,
  };

  const context = await applyRequestInterceptors(initialContext);

  const { method = "GET", body, headers, ...restConfig } = context.config;

  try {
    const response = await fetch(context.url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      ...restConfig,
    });

    const nextResponse = await applyResponseInterceptors(response, context);

    if (!nextResponse.ok) {
      const errorPayload = await safeParseResponseBody(nextResponse).catch(() => null);
      const errorMessage =
        typeof errorPayload === "object" &&
        errorPayload !== null &&
        "message" in errorPayload &&
        typeof (errorPayload as { message?: unknown }).message === "string"
          ? (errorPayload as { message: string }).message
          : `Request failed with status ${nextResponse.status}`;

      const apiError = new ApiError(errorMessage, nextResponse.status, undefined, errorPayload);
      throw await applyErrorInterceptors(apiError, context);
    }

    if (nextResponse.status === 204) {
      return undefined as T;
    }

    const payload = await safeParseResponseBody(nextResponse);
    return unwrapApiResponse<T>(payload);
  } catch (error) {
    if (error instanceof RetryRequestError) {
      return request<T>(endpoint, config);
    }
    const mappedError = await applyErrorInterceptors(toApiError(error), context);
    if (mappedError instanceof RetryRequestError) {
      return request<T>(endpoint, config);
    }
    throw mappedError;
  }
};

export const apiClient = {
  addRequestInterceptor(interceptor: RequestInterceptor) {
    requestInterceptors.push(interceptor);
  },
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    responseInterceptors.push(interceptor);
  },
  addErrorInterceptor(interceptor: ErrorInterceptor) {
    errorInterceptors.push(interceptor);
  },
  get: <T>(endpoint: string, config: Omit<ApiRequestConfig, "method" | "body"> = {}) =>
    request<T>(endpoint, { ...config, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, config: Omit<ApiRequestConfig, "method" | "body"> = {}) =>
    request<T>(endpoint, { ...config, method: "POST", body }),
  put: <T>(endpoint: string, body?: unknown, config: Omit<ApiRequestConfig, "method" | "body"> = {}) =>
    request<T>(endpoint, { ...config, method: "PUT", body }),
  patch: <T>(endpoint: string, body?: unknown, config: Omit<ApiRequestConfig, "method" | "body"> = {}) =>
    request<T>(endpoint, { ...config, method: "PATCH", body }),
  delete: <T>(endpoint: string, config: Omit<ApiRequestConfig, "method" | "body"> = {}) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};
