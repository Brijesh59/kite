export interface LoggerConfig {
  level: string;
  maxFiles: string;
  maxSize: string;
  datePattern: string;
  zippedArchive: boolean;
  enableConsole: boolean;
  enableFileLogging: boolean;
  logDirectory: string;
}

export const loggerConfig: LoggerConfig = {
  // Default log level (can be overridden by LOG_LEVEL env var)
  level: process.env.LOG_LEVEL || "info",

  // How long to keep log files
  maxFiles: process.env.LOG_MAX_FILES || "14d",

  // Maximum size of each log file before rotation
  maxSize: process.env.LOG_MAX_SIZE || "20m",

  // Date pattern for log file rotation
  datePattern: process.env.LOG_DATE_PATTERN || "YYYY-MM-DD",

  // Whether to compress old log files
  zippedArchive: process.env.LOG_ZIPPED_ARCHIVE !== "false",

  // Enable console logging (usually disabled in production)
  enableConsole: process.env.NODE_ENV !== "production",

  // Enable file logging
  enableFileLogging: process.env.LOG_ENABLE_FILE !== "false",

  // Log directory
  logDirectory: process.env.LOG_DIRECTORY || "logs",
};

// Log levels in order of priority
export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export default loggerConfig;
