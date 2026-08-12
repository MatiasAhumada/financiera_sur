import type { ToastOptions } from "@/utils/toast.util";

export interface HandlerOptions {
  logToConsole?: boolean;
  showToast?: boolean;
  messagePrefix?: string;
  defaultMessage?: string;
  toastOptions?: ToastOptions;
}

export interface ErrorWithMessage {
  message: string;
}
