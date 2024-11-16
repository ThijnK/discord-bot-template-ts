import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { cwd } from 'node:process';
import { EMOJIS } from 'utils';

export enum LogType {
  Info = 'info',
  Error = 'error',
  Warn = 'warn',
  Debug = 'debug',
  System = 'system',
}

type LoggerConfig = {
  /**
   * Whether to log messages to the console.
   * @default true
   */
  console?: boolean;
  /**
   * Whether to log messages to a file.
   *
   * If it does not yet exist, a file will be created in the `/logs` directory, with the ISO formatted date in the name (so `<YY-MM-DD>.log`).
   * Optionally, you may overwrite the file name by providing a string.
   * @default false
   */
  file?: boolean | string;
  /**
   * Discord webhook to log messages to (i.e. send messages to a Discord channel).
   *
   * The webhook must be a Discord webhook.
   * If is not set (i.e. `undefined`), which is the default, messages will not be logged to a webhook.
   * @default undefined
   * @example 'https://discord.com/api/webhooks/...'
   * @see https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks
   */
  webhook?: string;
  /**
   * Log types to ignore when logging to the webhook.
   *
   * If not set (i.e. `undefined`), which is the default, all log types will be logged to the webhook.
   * @default undefined
   */
  webhookIgnore?: LogType[];
};

/**
 * Create a logger for a specific category
 * @param category The category of the logger
 * @returns A logger, exposing methods to log different types of messages (info, error, warn, debug, system)
 */
export class Logger {
  category: string;
  private config: LoggerConfig;
  private file: string;

  constructor(
    category: string,
    config: LoggerConfig = {
      console: true,
      file: false,
      webhook: undefined,
      webhookIgnore: undefined,
    },
  ) {
    this.category = category;
    this.config = {
      console: config.console ?? true,
      file: config.file ?? false,
      webhook: config.webhook,
      webhookIgnore: config.webhookIgnore,
    };
    const filename = typeof config.file === 'string'
      ? config.file
      : `${new Date().toISOString().split('T')[0]}.log`;
    this.file = `${cwd()}/logs/${filename}`;
  }

  log(message: unknown, type: LogType = LogType.Info) {
    if (this.config.console) log(this.category, message, type);
    if (this.config.file) {
      if (!existsSync(`${cwd()}/logs`)) mkdirSync(`${cwd()}/logs`);
      appendFileSync(
        this.file,
        this.formatMessage(message, type) + '\n',
      );
    }
    if (this.config.webhook && !this.config.webhookIgnore?.includes(type)) {
      fetch(this.config.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `${EMOJIS[type]} **${type}** - ${message}`,
        }),
      }).catch(log.error.bind(null, 'webhook'));
    }
  }

  info(message: unknown) {
    this.log(message, LogType.Info);
  }

  error(message: unknown) {
    this.log(message, LogType.Error);
  }

  warn(message: unknown) {
    this.log(message, LogType.Warn);
  }

  debug(message: unknown) {
    this.log(message, LogType.Debug);
  }

  system(message: unknown) {
    this.log(message, LogType.System);
  }

  /** Format a message with the category of the logger instance */
  formatMessage(
    message: unknown,
    type: LogType = LogType.Info,
  ) {
    return Logger.formatMessage(this.category, message, type);
  }

  /** Format a message with a specific category and type */
  static formatMessage(
    category: string,
    message: unknown,
    type: LogType = LogType.Info,
  ) {
    return `[${new Date().toISOString()}] [${type}] ${category} - ${message}`;
  }
}

/**
 * Get the console text color for a specific log type
 * @param type The type of log to get the color for
 * @returns A string to be prepended to the log message
 */
const getTextColor = (type: LogType) => {
  switch (type) {
    case LogType.Info:
      return '\x1b[0m'; // White
    case LogType.System:
      return '\x1b[36m%s\x1b[0m'; // Cyan
    case LogType.Error:
      return '\x1b[31m%s\x1b[0m'; // Red
    case LogType.Warn:
      return '\x1b[33m%s\x1b[0m'; // Yellow
    case LogType.Debug:
      return '\x1b[90m%s\x1b[0m'; // Gray
    default:
      return '\x1b[37m%s\x1b[0m'; // White
  }
};

/**
 * Log a message to the console
 * @param category The category of the message, which will be displayed in brackets
 * @param message The message to log
 * @param type The type of message to log (info, error, warn, debug, system)
 */
export const log = (
  category: string,
  message: unknown,
  type: LogType = LogType.Info,
) =>
  console.log(
    getTextColor(type),
    Logger.formatMessage(category, message, type),
  );

log.info = log;

log.error = (category: string, message: unknown) =>
  log(category, message, LogType.Error);

log.warn = (category: string, message: unknown) =>
  log(category, message, LogType.Warn);

log.debug = (category: string, message: unknown) =>
  log(category, message, LogType.Debug);

log.system = (category: string, message: unknown) =>
  log(category, message, LogType.System);
