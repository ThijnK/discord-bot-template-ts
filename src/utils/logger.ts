export enum LogType {
  Info = 'info',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  System = 'system',
}

const getTextColor = (type: LogType) => {
  switch (type) {
    case 'info':
      return '\x1b[0m';
    case 'system':
      return '\x1b[36m%s\x1b[0m';
    case 'error':
      return '\x1b[31m%s\x1b[0m';
    case 'warn':
      return '\x1b[33m%s\x1b[0m';
    case 'debug':
      return '\x1b[90m%s\x1b[0m';
    default:
      return '\x1b[37m%s\x1b[0m';
  }
};

/**
 * Log a message to the console
 * @param category The category of the message, which will be displayed in brackets
 * @param message The message to log
 * @param type The type of message to log (info, error, warn, debug, system)
 */
const log = (category: string, message: string, type: LogType = LogType.Info) =>
  console.log(
    getTextColor(type),
    `[${type}] ${category.toLowerCase()} - ${message}`
  );

log.error = (category: string, message: string) =>
  log(category, message, LogType.Error);

log.warn = (category: string, message: string) =>
  log(category, message, LogType.Warn);

log.debug = (category: string, message: string) =>
  log(category, message, LogType.Debug);

log.system = (category: string, message: string) =>
  log(category, message, LogType.System);

export default log;
