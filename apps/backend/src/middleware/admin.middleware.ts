import { Request, Response, NextFunction } from "express";
import { UnauthorizedException, ForbiddenException } from "../common/app-error";
import { ROLES } from "@kite/config";

/**
 * Middleware to check if user is authenticated and has ADMIN role
 * This should be used after authMiddleware
 */
export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  // Check if user is authenticated
  if (!req.user) {
    throw new UnauthorizedException("Authentication required");
  }

  // Check if user has ADMIN role
  if (req.user.role !== ROLES.ADMIN) {
    throw new ForbiddenException(
      "Access denied. Admin privileges required."
    );
  }

  next();
};

// Alias for backward compatibility
export const isAdmin = adminMiddleware;
