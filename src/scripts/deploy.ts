import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import categories from '../commands';
import { ENV } from '../env';
import { Logger, extractMeta } from '../utils';

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);
const logger = new Logger('deploy');

async function main() {
  if (!ENV.TEST_GUILD)
    throw new Error('Missing environment variable: TEST_GUILD');
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  // In development, all commands are deployed to the test guild.
  if (ENV.DEV)
    await rest.put(
      Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD),
      {
        body: extractMeta(categories, 'all'),
      }
    );
  // In production, public commmands are deployed globally, and private commands
  // are deployed to the test guild.
  else {
    await rest.put(Routes.applicationCommands(currentUser.id), {
      body: extractMeta(categories, 'public'),
    });
    await rest.put(
      Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD),
      {
        body: extractMeta(categories, 'private'),
      }
    );
  }

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    logger.system(
      `Commands deployed for \x1b[4m${tag}\x1b[0m\x1b[36m${
        ENV.DEV ? ` in guild ${ENV.TEST_GUILD}` : ''
      }!`
    );
  })
  .catch((e) => logger.error(e));
