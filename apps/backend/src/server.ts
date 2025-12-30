import app from "./app";
import { logger } from "./common/logger";

const PORT = process.env.PORT || 9000;

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown, promise: Promise<any>) => {
  logger.error("Unhandled Promise Rejection:", {
    reason: reason instanceof Error ? reason.message : String(reason),
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise.toString(),
    timestamp: new Date().toISOString(),
  });

  // Graceful shutdown
  logger.info("Shutting down server due to unhandled promise rejection...");
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
  });

  // Graceful shutdown
  logger.info("Shutting down server due to uncaught exception...");
  process.exit(1);
});

// Handle SIGTERM (graceful shutdown)
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated gracefully");
    process.exit(0);
  });
});

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  logger.info("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Process terminated gracefully");
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  logger.info(`Server started successfully`, {
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    url: `http://localhost:${PORT}`,
    timestamp: new Date().toISOString(),
  });
});

// Handle server errors
server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Port ${PORT} is already in use`, {
      port: PORT,
      code: error.code,
      timestamp: new Date().toISOString(),
    });
  } else {
    logger.error("Server error:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
  }
  process.exit(1);
});

export default server;
