export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Thrown by 401 interceptor to signal retry after token refresh */
export class RetryRequestError extends Error {
  constructor() {
    super("Retry request after refresh");
    this.name = "RetryRequestError";
  }
}

export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
