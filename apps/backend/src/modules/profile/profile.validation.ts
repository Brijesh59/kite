import Joi from "joi";
import { INTEREST_OPTIONS } from "@kite/config";

export const profileValidation = {
  submit: {
    body: Joi.object({
      bio: Joi.string().max(500).optional().allow(""),
      avatar: Joi.string().uri().optional().allow(""),
      metadata: Joi.object({
        interests: Joi.array().items(Joi.string().valid(...INTEREST_OPTIONS)).optional(),
        location: Joi.string().max(100).optional().allow(""),
        address: Joi.object({
          street: Joi.string().optional().allow(""),
          city: Joi.string().optional().allow(""),
          state: Joi.string().optional().allow(""),
          zip: Joi.string().optional().allow(""),
          country: Joi.string().optional().allow(""),
        }).optional(),
      }).optional(),
    }),
  },
};
