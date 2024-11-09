import process from 'node:process';
import { Client, GatewayIntentBits } from 'discord.js';
import { log } from 'utils';
import ENV from 'env';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.login(ENV.BOT_TOKEN).catch((err) => {
  log.error('login', err);
  process.exit(1);
});

export default client;
