import { z } from "zod";
import { VALIDATION_RULES, PASSWORD_ERROR_MESSAGES } from "@kite/config";
import { userSchema } from "./user.types";

const emailSchema = z.string().email("Please provide a valid email address");

const mobileSchema = z
  .string()
  .regex(VALIDATION_RULES.mobile.pattern, "Please provide a valid mobile number");

const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.password.minLength, PASSWORD_ERROR_MESSAGES.minLength)
  .regex(VALIDATION_RULES.password.pattern, PASSWORD_ERROR_MESSAGES.invalid);

const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only numbers");

export const loginRequestSchema = z
  .object({
    email: emailSchema.optional(),
    mobile: mobileSchema.optional(),
    password: z.string().min(1, "Password is required").optional(),
    otp: otpSchema.optional(),
    clientType: z.enum(["web", "admin"]).optional(),
  })
  .refine((data) => Boolean(data.email || data.mobile), {
    message: "Email or mobile is required",
  })
  .refine((data) => Boolean(data.password || data.otp), {
    message: "Password or OTP is required",
  });
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.name.minLength,
      `Name must be at least ${VALIDATION_RULES.name.minLength} characters long`
    )
    .max(
      VALIDATION_RULES.name.maxLength,
      `Name cannot exceed ${VALIDATION_RULES.name.maxLength} characters`
    ),
  email: emailSchema,
  mobile: mobileSchema.optional(),
  password: passwordSchema,
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const sendOtpRequestSchema = z
  .object({
    email: emailSchema.optional(),
    mobile: mobileSchema.optional(),
  })
  .refine((data) => Boolean(data.email || data.mobile), {
    message: "Either email or mobile number is required",
  });
export type SendOtpRequest = z.infer<typeof sendOtpRequestSchema>;

export const verifyOtpRequestSchema = sendOtpRequestSchema.safeExtend({
  otp: otpSchema,
});
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});
export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string().optional(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  token: z.string(),
  expiresAt: z.string(),
  createdAt: z.string(),
});
export type Session = z.infer<typeof sessionSchema>;

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});
export type AuthTokens = z.infer<typeof authTokensSchema>;
