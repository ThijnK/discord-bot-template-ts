import { APIUser, REST, Routes } from 'discord.js';
import ENV from 'env';
import { Logger } from 'utils';

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);
const logger = new Logger('clear');

async function main() {
  if (!ENV.TEST_GUILD) {
    throw new Error('Missing environment variable: TEST_GUILD');
  }
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  await rest.put(Routes.applicationCommands(currentUser.id), { body: [] });
  await rest.put(
    Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD),
    { body: [] },
  );

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    logger.system(`Commands cleared for \x1b[4m${tag}\x1b[0m\x1b[36m!`);
  })
  .catch((e) => logger.error(e));
