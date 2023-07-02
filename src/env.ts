import { log } from './utils';

const isDev =
  process.env.NODE_ENV !== 'production' &&
  process.env.NODE_ENV !== 'PRODUCTION';

export const ENV = {
  /** Whether or not the app is running in the development environment */
  DEV: isDev,
  /** Discord bot token */
  BOT_TOKEN: (isDev ? process.env.TEST_TOKEN : process.env.BOT_TOKEN) ?? '',
  /** ID of the Discord guild to use for testing */
  TEST_GUILD: process.env.TEST_GUILD ?? '',
} as const;

// Check to make sure no environment variables are missing
for (const [key, value] of Object.entries(ENV)) {
  if (!value) {
    log.error('env', `Missing environment variable: ${key}`);
    process.exit(1);
  }
}
