import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { logger } from "../common/logger";

export interface ValidationOptions {
  body?: Joi.Schema;
  query?: Joi.Schema;
  params?: Joi.Schema;
}

export const validate = (schemas: ValidationOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true,
        });

        if (error) {
          throw error;
        }
        req.body = value;
      }

      // Validate query
      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true,
        });

        if (error) {
          throw error;
        }
        // Use Object.assign to update query params without reassigning
        Object.assign(req.query, value);
      }

      // Validate params
      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, {
          abortEarly: false,
          allowUnknown: false,
          stripUnknown: true,
        });

        if (error) {
          throw error;
        }
        req.params = value;
      }

      next();
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        logger.warn("Validation failed", {
          errors: error.details.map((detail) => detail.message),
          details: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
            value: detail.context?.value,
          })),
          requestId: req.headers["x-request-id"],
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.details.map((detail) => detail.message),
          details: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        });
      }

      // Unknown validation error
      logger.error("Unknown validation error", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};
