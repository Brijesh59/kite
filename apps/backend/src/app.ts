import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppError } from "./common/app-error";
import { setAuthRoutes } from "./modules/auth/auth.routes";
import { setPostRoutes } from "./modules/post/post.routes";
import { setAdminRoutes } from "./modules/admin/admin.routes";
import { setProfileRoutes } from "./modules/profile/profile.routes";
import { httpLogger } from "./middleware/httpLogger";

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      process.env.ADMIN_PANEL_URL || "http://localhost:5173",
      process.env.WEB_APP_URL || "http://localhost:5174",
    ],
    credentials: true, // Enable cookies
  })
);
app.use(express.json());
app.use(cookieParser()); // Add cookie parser for HTTP-only cookies
app.use(httpLogger); // Add HTTP logging middleware

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Server is healthy",
  });
});

// Set up routes
setAuthRoutes(app);
setPostRoutes(app);
setAdminRoutes(app);
setProfileRoutes(app);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Fallback for unhandled errors
  console.error(err);
  return res.status(500).json({
    statusCode: 500,
    message: "Something went wrong",
  });
});

export default app;
