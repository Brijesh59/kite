import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../modules/auth/auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  // Determine which cookie to use based on request origin
  const origin = req.headers.origin || req.headers.referer || "";
  const adminPanelUrl = process.env.ADMIN_PANEL_URL || "http://localhost:5173";
  const webAppUrl = process.env.WEB_APP_URL || "http://localhost:5174";

  const isAdminRequest = origin.startsWith(adminPanelUrl);
  const isWebRequest = origin.startsWith(webAppUrl);

  // Prioritize the correct cookie based on origin
  if (isAdminRequest && req.cookies?.admin_accessToken) {
    token = req.cookies.admin_accessToken;
  } else if (isWebRequest && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.cookies?.admin_accessToken) {
    token = req.cookies.admin_accessToken;
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }
  // Fall back to Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided, authorization denied",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

    // Create user object from decoded token
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    } as User;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Access Token is invalid or expired",
    });
  }
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole(["ADMIN"]);
