export const ENV = {
  DEV:
    process.env.NODE_ENV !== 'production' &&
    process.env.NODE_ENV !== 'PRODUCTION',
  /** Discord bot token */
  BOT_TOKEN: process.env.BOT_TOKEN ?? '',
  /** ID of the Discord guild to use for testing */
  TEST_GUILD: process.env.TEST_GUILD ?? '',
} as const;

for (const [key, value] of Object.entries(ENV)) {
  if (!value) throw new Error(`Missing ENV variable: ${key}`);
}
