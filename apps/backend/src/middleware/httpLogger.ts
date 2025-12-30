import { Request, Response, NextFunction } from "express";
import { logger } from "../common/logger";

interface RequestWithStartTime extends Request {
  startTime?: number;
}

export const httpLogger = (
  req: RequestWithStartTime,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  // Log incoming request
  logger.http("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString(),
    headers: {
      "content-type": req.get("Content-Type"),
      authorization: req.get("Authorization") ? "Bearer [REDACTED]" : undefined,
      "x-forwarded-for": req.get("X-Forwarded-For"),
      "x-real-ip": req.get("X-Real-IP"),
    },
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    bodySize: req.get("Content-Length"),
  });

  // Log response when response finishes
  res.on("finish", () => {
    const responseTime = req.startTime ? Date.now() - req.startTime : 0;

    // Log response
    logger.http("Outgoing response", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get("Content-Length"),
      timestamp: new Date().toISOString(),
    });

    // Log slow requests as warnings (configurable threshold)
    const slowThreshold = parseInt(
      process.env.SLOW_REQUEST_THRESHOLD || "3000"
    );
    if (responseTime > slowThreshold) {
      logger.warn("Slow request detected", {
        method: req.method,
        url: req.url,
        responseTime: `${responseTime}ms`,
        statusCode: res.statusCode,
        threshold: `${slowThreshold}ms`,
      });
    }

    // Log error responses with more context
    if (res.statusCode >= 400) {
      const logLevel = res.statusCode >= 500 ? "error" : "warn";
      logger[logLevel]("HTTP error response", {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        ip: req.ip || req.connection.remoteAddress || req.socket.remoteAddress,
        userAgent: req.get("User-Agent"),
        // Add error context for debugging
        ...(res.statusCode >= 500 && { severity: "high" }),
      });
    }
  });

  // Handle request errors/aborts
  // Handle request errors/aborts
  res.on("error", (error) => {
    logger.error("Response error", {
      method: req.method,
      url: req.url,
      error: error.message,
      stack: error.stack,
    });
  });

  next();
};

export default httpLogger;
