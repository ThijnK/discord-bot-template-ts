import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import { ENV } from '../../env';

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
  .then((user) => console.log(`Commands cleared for ${user.username}!`))
  .catch(console.error);
