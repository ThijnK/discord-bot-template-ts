import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import { ENV } from '../env';
import { log } from '../utils';

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  await rest.put(Routes.applicationCommands(currentUser.id), { body: [] });
  await rest.put(
    Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD),
    { body: [] }
  );

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    log.system('clear', `Commands cleared for \x1b[4m${tag}\x1b[0m\x1b[36m!`);
  })
  .catch(console.error);
