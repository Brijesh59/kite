import type { User } from "./user.types";

export interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
  otp?: string;
  clientType?: 'web' | 'admin';
}

export interface RegisterRequest {
  name: string;
  email: string;
  mobile?: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}
