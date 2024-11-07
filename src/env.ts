import process from 'node:process';
import { log } from 'utils';

const isDev = process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'PRODUCTION';

const ENV = {
  /** Whether or not the app is running in the development environment */
  DEV: isDev,
  /**
   * Discord bot token.
   *
   * If `DEV` is true, the `TEST_TOKEN` environment variable will be used instead (if it exists, otherwise `BOT_TOKEN` will still be used).
   */
  BOT_TOKEN: (isDev ? process.env.TEST_TOKEN : process.env.BOT_TOKEN) ??
    process.env.BOT_TOKEN ??
    '',
  /** ID of the Discord guild to use for testing */
  TEST_GUILD: process.env.TEST_GUILD ?? null,
} as const;

// Check to make sure no environment variables are missing
for (const [key, value] of Object.entries(ENV)) {
  if (value === undefined || value === '') {
    log.error('env', `Missing environment variable: ${key}`);
    process.exit(1);
  }
}

export default ENV;
