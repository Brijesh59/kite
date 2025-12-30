import Joi from "joi";
import { VALIDATION_RULES, PASSWORD_ERROR_MESSAGES } from "@kite/config";

// Common schemas using shared config
const email = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required",
});

const password = Joi.string()
  .min(VALIDATION_RULES.password.minLength)
  .pattern(VALIDATION_RULES.password.pattern)
  .required()
  .messages({
    "string.min": PASSWORD_ERROR_MESSAGES.minLength,
    "string.pattern.base": PASSWORD_ERROR_MESSAGES.invalid,
    "any.required": "Password is required",
  });

const name = Joi.string()
  .min(VALIDATION_RULES.name.minLength)
  .max(VALIDATION_RULES.name.maxLength)
  .required()
  .messages({
    "string.min": `Name must be at least ${VALIDATION_RULES.name.minLength} characters long`,
    "string.max": `Name cannot exceed ${VALIDATION_RULES.name.maxLength} characters`,
    "any.required": "Name is required",
  });

const mobile = Joi.string()
  .pattern(VALIDATION_RULES.mobile.pattern)
  .optional()
  .messages({
    "string.pattern.base": "Please provide a valid mobile number",
  });

const otp = Joi.string()
  .length(6)
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only numbers",
    "any.required": "OTP is required",
  });

const token = Joi.string().required().messages({
  "any.required": "Token is required",
});

// Auth validation schemas
export const authValidation = {
  register: {
    body: Joi.object({
      name,
      email,
      mobile,
      password,
    }),
  },

  login: {
    body: Joi.object({
      email,
      password,
      clientType: Joi.string().valid('web', 'admin').optional(),
    }),
  },

  sendOtp: {
    body: Joi.object({
      email: email.optional(),
      mobile: mobile.optional(),
    })
      .or("email", "mobile")
      .messages({
        "object.missing": "Either email or mobile number is required",
      }),
  },

  verifyOtp: {
    body: Joi.object({
      email: email.optional(),
      mobile: mobile.optional(),
      otp,
    })
      .or("email", "mobile")
      .messages({
        "object.missing": "Either email or mobile number is required",
      }),
  },

  forgotPassword: {
    body: Joi.object({
      email,
    }),
  },

  resetPassword: {
    body: Joi.object({
      token,
      password,
    }),
  },

  refreshToken: {
    // No body validation needed for refresh token - handled by middleware
  },
};
