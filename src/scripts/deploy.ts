import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import categories from '../commands';
import { ENV } from '../env';
import { log } from '../utils';

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint = ENV.DEV
    ? Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD)
    : Routes.applicationCommands(currentUser.id);

  // Do not register private commands in production
  const body = categories
    .map(({ commands }) =>
      (ENV.DEV ? commands.all : commands.public).map(({ meta }) => meta)
    )
    .flat();

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
