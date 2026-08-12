import { AxiosError } from "axios";
import type {
  HandlerOptions,
  ErrorWithMessage,
} from "@/interfaces/handler.interface";
import {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
} from "@/utils/toast.util";
import { ERROR_MESSAGES } from "@/constants/error-messages.constant";

function normalizeError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const isNetworkError = !error.response;
    return {
      name: "AxiosError",
      message: isNetworkError
        ? "Error de conexión"
        : error.response?.data?.error?.message || error.message,
      stack: error.response?.data?.error?.stack || error.stack,
    };
  }

  if (error instanceof Object && !("message" in error)) {
    return new Error(ERROR_MESSAGES.FORM_VALIDATION);
  }

  if (error instanceof Error) return error;
  if (error instanceof String) return new Error(error.toString());

  if (error instanceof Object && "message" in error) {
    const errorWithMessage = error as ErrorWithMessage;
    if (errorWithMessage.message) return new Error(errorWithMessage.message);
    return new Error(JSON.stringify(error));
  }

  return new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
}

export function clientErrorHandler(
  error: unknown,
  callback = () => {},
  {
    logToConsole = true,
    showToast = true,
    messagePrefix = "",
    defaultMessage = "Error desconocido",
    toastOptions = {},
  }: HandlerOptions = {},
): void {
  const normalizedError = normalizeError(error);

  if (logToConsole) console.error(normalizedError);
  if (showToast) {
    const displayMessage = normalizedError.message || defaultMessage;
    toastError(`${messagePrefix}${displayMessage}`, toastOptions);
  }

  callback();
}

export function clientSuccessHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = false,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  if (showToast) {
    toastSuccess(`${messagePrefix}${message}`, toastOptions);
  }

  callback();
}

export function clientWarningHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = true,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  if (logToConsole) console.warn(message);
  if (showToast) {
    toastWarning(`${messagePrefix}${message}`, toastOptions);
  }

  callback();
}

export function clientInfoHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = false,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  if (logToConsole) console.info(message);
  if (showToast) {
    toastInfo(`${messagePrefix}${message}`, toastOptions);
  }

  callback();
}

export default clientErrorHandler;
