import Joi from "joi";

// Common schemas
const email = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required",
});

const password = Joi.string()
  .min(8)
  .pattern(
    new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
    )
  )
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    "any.required": "Password is required",
  });

const name = Joi.string().min(2).max(50).required().messages({
  "string.min": "Name must be at least 2 characters long",
  "string.max": "Name cannot exceed 50 characters",
  "any.required": "Name is required",
});

const mobile = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .required()
  .messages({
    "string.pattern.base": "Please provide a valid 10-digit mobile number",
    "any.required": "Mobile number is required",
  });

const role = Joi.string()
  .valid("ADMIN", "ORGANISER", "MEMBER")
  .required()
  .messages({
    "any.only": "Role must be one of: ADMIN, ORGANISER, MEMBER",
    "any.required": "Role is required",
  });

const userId = Joi.string().uuid().required().messages({
  "string.guid": "Please provide a valid user ID",
  "any.required": "User ID is required",
});

// Create user validation
export const createUserValidation = Joi.object({
  name,
  email,
  mobile: mobile.optional(),
  password,
  role: role.default("MEMBER"),
});

// Update user validation
export const updateUserValidation = Joi.object({
  name: name.optional(),
  email: email.optional(),
  mobile: mobile.optional(),
  role: role.optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// User ID parameter validation
export const userIdValidation = Joi.object({
  id: userId,
});

// Query parameters validation for get all users
export const getUsersQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().optional(),
  role: Joi.string().valid("ADMIN", "ORGANISER", "MEMBER").optional(),
  sortBy: Joi.string()
    .valid("name", "email", "createdAt", "updatedAt")
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
});
