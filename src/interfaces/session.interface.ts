export interface SessionUser {
  name: string;
  email: string;
  role: string;
}

export interface SessionResponse {
  authenticated: boolean;
  user?: SessionUser;
  expiresAt?: string;
}

export interface CreateSessionInput {
  email: string;
  password: string;
}
