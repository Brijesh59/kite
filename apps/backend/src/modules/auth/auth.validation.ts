import {
  forgotPasswordRequestSchema,
  loginRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  sendOtpRequestSchema,
  verifyOtpRequestSchema,
} from "@kite/types";

export const authValidation = {
  register: {
    body: registerRequestSchema,
  },
  login: {
    body: loginRequestSchema,
  },
  sendOtp: {
    body: sendOtpRequestSchema,
  },
  verifyOtp: {
    body: verifyOtpRequestSchema,
  },
  forgotPassword: {
    body: forgotPasswordRequestSchema,
  },
  resetPassword: {
    body: resetPasswordRequestSchema,
  },
  refreshToken: {},
};
