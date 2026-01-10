import Joi from "joi";
import { WORKSPACE_LIMITS } from "@kite/config";

export const workspaceValidation = {
  create: Joi.object({
    name: Joi.string()
      .min(WORKSPACE_LIMITS.nameMinLength)
      .max(WORKSPACE_LIMITS.nameMaxLength)
      .required()
      .messages({
        "string.min": `Workspace name must be at least ${WORKSPACE_LIMITS.nameMinLength} characters`,
        "string.max": `Workspace name must not exceed ${WORKSPACE_LIMITS.nameMaxLength} characters`,
        "any.required": "Workspace name is required",
      }),
    description: Joi.string()
      .max(WORKSPACE_LIMITS.descriptionMaxLength)
      .optional()
      .allow(null, "")
      .messages({
        "string.max": `Description must not exceed ${WORKSPACE_LIMITS.descriptionMaxLength} characters`,
      }),
  }),

  update: Joi.object({
    name: Joi.string()
      .min(WORKSPACE_LIMITS.nameMinLength)
      .max(WORKSPACE_LIMITS.nameMaxLength)
      .optional()
      .messages({
        "string.min": `Workspace name must be at least ${WORKSPACE_LIMITS.nameMinLength} characters`,
        "string.max": `Workspace name must not exceed ${WORKSPACE_LIMITS.nameMaxLength} characters`,
      }),
    description: Joi.string()
      .max(WORKSPACE_LIMITS.descriptionMaxLength)
      .optional()
      .allow(null, "")
      .messages({
        "string.max": `Description must not exceed ${WORKSPACE_LIMITS.descriptionMaxLength} characters`,
      }),
  }),

  getById: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Invalid workspace ID format",
      "any.required": "Workspace ID is required",
    }),
  }),

  delete: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Invalid workspace ID format",
      "any.required": "Workspace ID is required",
    }),
  }),

  getAll: Joi.object({
    page: Joi.number().integer().min(1).optional().default(1),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    search: Joi.string().optional().allow(""),
    isActive: Joi.boolean().optional(),
  }),
};
