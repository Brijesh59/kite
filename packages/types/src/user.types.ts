import { z } from "zod";
import { PAGINATION, VALIDATION_RULES, PASSWORD_ERROR_MESSAGES } from "@kite/config";
import {
  optionalBooleanQuerySchema,
  optionalIntegerQuerySchema,
} from "./schema-helpers";

export const userRoleSchema = z.enum(["ADMIN", "ORGANISER", "ARTIST", "USER"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  mobile: z.string().nullable().optional(),
  role: userRoleSchema,
  isActive: z.boolean(),
  isEmailVerified: z.boolean(),
  isMobileVerified: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bio: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const userWithProfileSchema = userSchema.extend({
  profile: userProfileSchema.optional(),
});
export type UserWithProfile = z.infer<typeof userWithProfileSchema>;

export const createUserRequestSchema = z.object({
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
  email: z.string().email("Please provide a valid email address"),
  mobile: z
    .string()
    .regex(VALIDATION_RULES.mobile.pattern, "Please provide a valid mobile number")
    .optional(),
  password: z
    .string()
    .min(VALIDATION_RULES.password.minLength, PASSWORD_ERROR_MESSAGES.minLength)
    .regex(VALIDATION_RULES.password.pattern, PASSWORD_ERROR_MESSAGES.invalid),
  role: userRoleSchema.default("USER"),
});
export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export const updateUserRequestSchema = z
  .object({
    name: z
      .string()
      .min(
        VALIDATION_RULES.name.minLength,
        `Name must be at least ${VALIDATION_RULES.name.minLength} characters long`
      )
      .max(
        VALIDATION_RULES.name.maxLength,
        `Name cannot exceed ${VALIDATION_RULES.name.maxLength} characters`
      )
      .optional(),
    email: z.string().email("Please provide a valid email address").optional(),
    mobile: z
      .string()
      .regex(VALIDATION_RULES.mobile.pattern, "Please provide a valid mobile number")
      .optional(),
    password: z
      .string()
      .min(VALIDATION_RULES.password.minLength, PASSWORD_ERROR_MESSAGES.minLength)
      .regex(VALIDATION_RULES.password.pattern, PASSWORD_ERROR_MESSAGES.invalid)
      .optional(),
    role: userRoleSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;

export const getUsersQuerySchema = z.object({
  page: optionalIntegerQuerySchema(),
  limit: optionalIntegerQuerySchema(PAGINATION.maxLimit),
  search: z.string().optional(),
  role: userRoleSchema.optional(),
  isActive: optionalBooleanQuerySchema,
  sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
