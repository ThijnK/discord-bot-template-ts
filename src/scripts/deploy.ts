import 'dotenv/config';
import { REST, Routes, APIUser } from 'discord.js';
import commands from '../commands';
import { ENV } from '../../env';

const body = commands
  .map(({ commands }) => commands.map(({ meta }) => meta))
  .flat();

const rest = new REST({ version: '10' }).setToken(ENV.BOT_TOKEN);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  const endpoint =
    process.env.NODE_ENV === 'production'
      ? Routes.applicationCommands(currentUser.id)
      : Routes.applicationGuildCommands(currentUser.id, ENV.TEST_GUILD);

  await rest.put(endpoint, { body });

  return currentUser;
}

main()
  .then((user) => {
    const tag = `${user.username}#${user.discriminator}`;
    const response =
      process.env.NODE_ENV === 'production'
        ? `Commands deployed for ${tag}!`
        : `Commands deployed for ${tag} in guild ${ENV.TEST_GUILD}!`;

    console.log(response);
  })
  .catch(console.error);
