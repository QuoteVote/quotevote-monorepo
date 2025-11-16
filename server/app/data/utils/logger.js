import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, errors, json, colorize } = winston.format;

// Custom format for development (readable)
const devFormat = printf(({ level, message, timestamp: ts, ...metadata }) => {
  let msg = `${ts} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

// Determine log level based on environment
const getLogLevel = () => {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') {
    return 'info'; // Only info and above in production
  }
  return 'debug'; // All logs in development
};

// Create transports array
const transports = [];

// Console transport - colored output for development, JSON for production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        timestamp(),
        errors({ stack: true }),
        json()
      ),
      level: getLogLevel(),
    })
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        errors({ stack: true }),
        devFormat
      ),
      level: getLogLevel(),
    })
  );
}

// File transports
const logDir = process.env.LOG_DIR || './logs';

// Combined log file (all logs)
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    level: getLogLevel(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

// Error log file (errors only)
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

// Legacy log file (for backward compatibility)
transports.push(
  new winston.transports.File({
    filename: 'hhsb.log',
    format: combine(
      timestamp(),
      errors({ stack: true }),
      json()
    ),
    level: getLogLevel(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

export const logger = winston.createLogger({
  level: getLogLevel(),
  format: combine(
    timestamp(),
    errors({ stack: true })
  ),
  defaultMeta: {
    service: 'quotevote-api',
  },
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Create a stream object for compatibility with Express morgan or other middleware
export const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
