import Joi from "joi";
import { POST_LIMITS, PAGINATION, POST_STATUS } from "@kite/config";

// Post validation schemas
export const postValidation = {
  create: {
    body: Joi.object({
      title: Joi.string()
        .min(POST_LIMITS.titleMinLength)
        .max(POST_LIMITS.titleMaxLength)
        .required()
        .messages({
          "string.min": `Title must be at least ${POST_LIMITS.titleMinLength} character long`,
          "string.max": `Title cannot exceed ${POST_LIMITS.titleMaxLength} characters`,
          "any.required": "Title is required",
        }),
      content: Joi.string()
        .max(POST_LIMITS.contentMaxLength)
        .required()
        .messages({
          "string.max": `Content cannot exceed ${POST_LIMITS.contentMaxLength} characters`,
          "any.required": "Content is required",
        }),
    }),
  },

  update: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.uuid": "Invalid post ID format",
        "any.required": "Post ID is required",
      }),
    }),
    body: Joi.object({
      title: Joi.string()
        .min(POST_LIMITS.titleMinLength)
        .max(POST_LIMITS.titleMaxLength)
        .optional()
        .messages({
          "string.min": `Title must be at least ${POST_LIMITS.titleMinLength} character long`,
          "string.max": `Title cannot exceed ${POST_LIMITS.titleMaxLength} characters`,
        }),
      content: Joi.string()
        .max(POST_LIMITS.contentMaxLength)
        .optional()
        .messages({
          "string.max": `Content cannot exceed ${POST_LIMITS.contentMaxLength} characters`,
        }),
    })
      .min(1)
      .messages({
        "object.min": "At least one field must be provided for update",
      }),
  },

  publish: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.uuid": "Invalid post ID format",
        "any.required": "Post ID is required",
      }),
    }),
  },

  unpublish: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.uuid": "Invalid post ID format",
        "any.required": "Post ID is required",
      }),
    }),
  },

  getById: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.uuid": "Invalid post ID format",
        "any.required": "Post ID is required",
      }),
    }),
  },

  delete: {
    params: Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.uuid": "Invalid post ID format",
        "any.required": "Post ID is required",
      }),
    }),
  },

  getAll: {
    query: Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .default(PAGINATION.defaultPage)
        .optional()
        .messages({
          "number.integer": "Page must be an integer",
          "number.min": "Page must be at least 1",
        }),
      limit: Joi.number()
        .integer()
        .min(1)
        .max(PAGINATION.maxLimit)
        .default(PAGINATION.defaultLimit)
        .optional()
        .messages({
          "number.integer": "Limit must be an integer",
          "number.min": "Limit must be at least 1",
          "number.max": `Limit cannot exceed ${PAGINATION.maxLimit}`,
        }),
      status: Joi.string()
        .valid("DRAFT", "PUBLISHED", "ALL")
        .optional(),
      search: Joi.string().min(2).max(100).optional().messages({
        "string.min": "Search term must be at least 2 characters long",
        "string.max": "Search term cannot exceed 100 characters",
      }),
    }),
  },
};
