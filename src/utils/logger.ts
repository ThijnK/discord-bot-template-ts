export enum LogType {
  Default = 'default',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  System = 'system',
}

/**
 * Get the console text color for a specific log type
 * @param type The type of log to get the color for
 * @returns A string to be prepended to the log message
 */
const getTextColor = (type: LogType) => {
  switch (type) {
    case 'default':
      return '\x1b[0m'; // White
    case 'system':
      return '\x1b[36m%s\x1b[0m'; // Cyan
    case 'error':
      return '\x1b[31m%s\x1b[0m'; // Red
    case 'warn':
      return '\x1b[33m%s\x1b[0m'; // Yellow
    case 'debug':
      return '\x1b[90m%s\x1b[0m'; // Gray
    default:
      return '\x1b[37m%s\x1b[0m'; // White
  }
};

/**
 * Create a logger for a specific category
 * @param category The category of the logger
 * @returns A logger, exposing methods to log different types of messages (info, error, warn, debug, system)
 */
export class Logger {
  category: string;

  constructor(category: string) {
    this.category = category;
  }

  log(message: unknown, type: LogType = LogType.Default) {
    log(this.category, message, type);
  }

  info(message: unknown) {
    log(this.category, message, LogType.Default);
  }

  error(message: unknown) {
    log(this.category, message, LogType.Error);
  }

  warn(message: unknown) {
    log(this.category, message, LogType.Warn);
  }

  debug(message: unknown) {
    log(this.category, message, LogType.Debug);
  }

  system(message: unknown) {
    log(this.category, message, LogType.System);
  }
}

/**
 * Log a message to the console
 * @param category The category of the message, which will be displayed in brackets
 * @param message The message to log
 * @param type The type of message to log (info, error, warn, debug, system)
 */
export const log = (
  category: string,
  message: unknown,
  type: LogType = LogType.Default
) =>
  console.log(
    getTextColor(type),
    `[${type}] ${category.toLowerCase()} - ${message}`
  );

log.error = (category: string, message: unknown) =>
  log(category, message, LogType.Error);

log.warn = (category: string, message: unknown) =>
  log(category, message, LogType.Warn);

log.debug = (category: string, message: unknown) =>
  log(category, message, LogType.Debug);

log.system = (category: string, message: unknown) =>
  log(category, message, LogType.System);
