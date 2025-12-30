// Re-export types from shared packages
export type {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  Session,
} from "@kite/types";

export { ROLES, type Role } from "@kite/config";

// Auth-specific types (not in shared package)
export interface SendOtpRequest {
  email?: string;
  mobile?: string;
}

export interface VerifyOtpRequest {
  email?: string;
  mobile?: string;
  otp: string;
}
