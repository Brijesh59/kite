import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { loggerConfig, LOG_LEVELS } from "./loggerConfig";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), loggerConfig.logDirectory);

// Custom format for better readability
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create transport for each log level with daily rotation
const createDailyRotateTransport = (
  level: string,
  filename: string,
  maxFiles?: string
) => {
  return new DailyRotateFile({
    level,
    filename: path.join(logsDir, `${filename}-%DATE%.log`),
    datePattern: loggerConfig.datePattern,
    zippedArchive: loggerConfig.zippedArchive,
    maxSize: loggerConfig.maxSize,
    maxFiles: maxFiles || loggerConfig.maxFiles,
    format: customFormat,
  });
};

// Configure Winston logger
const winstonLogger = winston.createLogger({
  level: loggerConfig.level,
  levels: LOG_LEVELS,
  format: customFormat,
  defaultMeta: { service: "backend" },
  transports: loggerConfig.enableFileLogging
    ? [
        // Error logs - only errors
        createDailyRotateTransport("error", "error"),

        // Warning logs - warnings and above
        createDailyRotateTransport("warn", "warn"),

        // Info logs - info and above
        createDailyRotateTransport("info", "info"),

        // Debug logs - all levels
        createDailyRotateTransport("debug", "debug"),

        // Combined logs - all levels in one file
        createDailyRotateTransport("debug", "combined"),

        // HTTP logs for API requests
        createDailyRotateTransport("http", "http", "30d"),
      ]
    : [],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: loggerConfig.enableFileLogging
    ? [createDailyRotateTransport("error", "exceptions", "30d")]
    : [],
  rejectionHandlers: loggerConfig.enableFileLogging
    ? [createDailyRotateTransport("error", "rejections", "30d")]
    : [],
});

// Add console transport for development
if (loggerConfig.enableConsole) {
  winstonLogger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create logger interface that matches the original simple logger
export const logger = {
  info: (message: string, meta?: any) => {
    winstonLogger.info(message, meta);
  },
  warn: (message: string, meta?: any) => {
    winstonLogger.warn(message, meta);
  },
  error: (message: string, meta?: any) => {
    winstonLogger.error(message, meta);
  },
  debug: (message: string, meta?: any) => {
    winstonLogger.debug(message, meta);
  },
  http: (message: string, meta?: any) => {
    winstonLogger.http(message, meta);
  },
  verbose: (message: string, meta?: any) => {
    winstonLogger.verbose(message, meta);
  },
  silly: (message: string, meta?: any) => {
    winstonLogger.silly(message, meta);
  },
  // Direct access to winston logger for advanced usage
  winston: winstonLogger,
};

// Export default logger
export default logger;
