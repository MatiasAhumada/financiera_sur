export interface ApiErrorOptions {
  status?: number;
  message?: string;
  isOperational?: boolean;
  stack?: string;
  internalCode?: string;
  details?: object | null;
}

export interface ResponseError {
  message: string;
  status: number;
  instance: string;
  method: string;
  stack?: string;
  internalCode?: string;
  details?: object | null;
}
