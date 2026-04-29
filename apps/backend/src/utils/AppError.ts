import { HttpStatusCode, HTTPSTATUS } from "../config/http.config";
import { ErrorCode } from "../constants/error-code";

export class AppError extends Error {
  public statusCode: HttpStatusCode;
  public errorCode?: keyof typeof ErrorCode;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: keyof typeof ErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || ErrorCode.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, this.constructor);
  }
}
