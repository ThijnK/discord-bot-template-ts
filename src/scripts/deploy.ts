import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import commands from '../commands';
import { ENV } from '../env';
import { log } from '../utils';

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint = ENV.DEV
    ? Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD)
    : Routes.applicationCommands(currentUser.id);

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    log.system(
      'deploy',
      `Commands deployed for \x1b[4m${tag}\x1b[0m\x1b[36m${
        ENV.DEV ? ` in guild ${ENV.TEST_GUILD}` : ''
      }!`
    );
  })
  .catch(console.error);
