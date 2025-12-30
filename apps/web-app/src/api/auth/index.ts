import { api } from "@/utils/api";

import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@kite/types";

export const loginApi = (data: LoginRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/login", { ...data, clientType: 'web' });

export const registerApi = (data: RegisterRequest) =>
  api.post<ApiResponse<LoginResponse>>("/auth/register", data);

export const forgotPasswordApi = (data: ForgotPasswordRequest) =>
  api.post<ApiResponse<{ message: string }>>("/auth/forgot-password", data);

export const resetPasswordApi = (data: ResetPasswordRequest) =>
  api.post<ApiResponse<{ message: string }>>("/auth/reset-password", data);

export const refreshTokenApi = () => api.post("/auth/refresh-token");

export const getCurrentUserApi = () =>
  api.get<ApiResponse<LoginResponse>>("/auth/me");
