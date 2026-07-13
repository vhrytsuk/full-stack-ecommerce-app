/**
 * Normalized API error surfaced to feature/entity code.
 * Keeps callers decoupled from transport details (fetch, status codes).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    options: {
      status: number;
      code?: string;
      fieldErrors?: Record<string, string[]>;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }
}
