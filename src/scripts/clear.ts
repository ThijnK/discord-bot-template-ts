import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "..", "..", ".env") });

import { REST, Routes, APIUser } from "discord.js";
import keys from "../keys";

const rest = new REST({ version: "10" }).setToken(keys.clientToken);

async function main() {
  const currentUser = (await rest.get(Routes.user())) as APIUser;

  await rest.put(Routes.applicationCommands(currentUser.id), { body: [] });
  await rest.put(
    Routes.applicationGuildCommands(currentUser.id, keys.testGuild),
    { body: [] }
  );

  return currentUser;
}

main()
  .then((user) =>
    console.log(`Successfully cleared commands for ${user.username}!`)
  )
  .catch(console.error);
