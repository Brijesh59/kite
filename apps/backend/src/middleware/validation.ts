import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { logger } from "../common/logger";

type ValidationSchema = z.ZodType;

export interface ValidationOptions {
  body?: ValidationSchema;
  query?: ValidationSchema;
  params?: ValidationSchema;
}

const formatZodIssue = (issue: z.ZodIssue) => ({
  field: issue.path.join("."),
  message: issue.message,
});

export const validate = (schemas: ValidationOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        const query = schemas.query.parse(req.query);
        Object.defineProperty(req, "query", {
          value: query,
          configurable: true,
          enumerable: true,
          writable: true,
        });
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as Request["params"];
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.issues.map(formatZodIssue);

        logger.warn("Validation failed", {
          errors: details.map((detail) => detail.message),
          details,
          requestId: req.headers["x-request-id"],
        });

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: details.map((detail) => detail.message),
          details,
        });
      }

      logger.error("Unknown validation error", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
    }
  };
};
