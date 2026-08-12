import httpStatus from "http-status";
import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "@/constants/config.constant";
import type {
  ApiErrorOptions,
  ResponseError,
} from "@/interfaces/apiError.interface";

const statusMessages: Record<number, string> = httpStatus;

export class ApiError extends Error {
  public readonly stack?: string;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly internalCode?: string;
  public readonly details?: object | null;

  constructor({
    status = httpStatus.INTERNAL_SERVER_ERROR,
    message = "",
    isOperational = true,
    stack,
    internalCode,
    details = null,
  }: ApiErrorOptions) {
    super(message);

    this.status = status;
    this.isOperational = isOperational;
    this.internalCode = internalCode;
    this.details = details;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this);
  }
}

export default function apiErrorHandler({
  error,
  request,
  fallbackMessage,
}: {
  error: ApiError;
  request: NextRequest;
  fallbackMessage?: string;
}) {
  let { status, message } = error;
  if (!error.isOperational) {
    status = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      fallbackMessage ?? statusMessages[httpStatus.INTERNAL_SERVER_ERROR];
  }
  if (!message) message = fallbackMessage ?? statusMessages[status];

  const errorResponse: ResponseError = {
    message,
    status: status,
    instance: request?.nextUrl?.pathname,
    method: request?.method,
  };

  if (error?.internalCode) errorResponse.internalCode = error.internalCode;
  if (error?.details) errorResponse.details = error.details;
  if (error?.stack && CONFIG.NODE_ENV === "development") {
    errorResponse.stack = error.stack;
  }

  console.error({ ...errorResponse });
  return NextResponse.json({ error: errorResponse }, { status });
}
