import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import { AppError } from "./app-error";
import { User } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Rate limiting configuration
const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      throw new AppError(message || "Rate limit exceeded", 429);
    },
  });
};

// Different rate limiters for different operations
export const authRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // max 5 requests per window
  "Too many authentication attempts, please try again in 15 minutes"
);

export const generalApiRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // max 100 requests per window
  "Too many API requests, please try again later"
);

export const adminRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  200, // higher limit for admin operations
  "Too many admin requests, please try again later"
);
