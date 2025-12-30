import { api } from "@/utils/api";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
} from "@kite/types";

export const loginApi = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/login", { ...data, clientType: 'admin' });

export const forgotPasswordApi = (data: ForgotPasswordRequest) =>
  api.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data);

export const resetPasswordApi = (data: ResetPasswordRequest) =>
  api.post<ApiResponse<{ message: string }>>("/auth/reset-password", data);

export const refreshTokenApi = () => api.post("/auth/refresh-token");
