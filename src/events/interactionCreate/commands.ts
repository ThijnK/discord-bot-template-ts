import commands from '../../commands';
import { Command } from '../../types';
import { event, Logger, reply } from '../../utils';

const allCommands = commands.map(({ commands }) => commands).flat();
const allCommandsMap = new Map<string, Command>(
  allCommands.map((c) => [c.meta.name, c])
);

export default event('interactionCreate', async ({ client }, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const logger = new Logger(`/${interaction.commandName}`);

  try {
    const command = allCommandsMap.get(interaction.commandName);

    if (!command)
      throw new Error(`Command "${interaction.commandName}" not found`);

    await command.exec({
      client,
      interaction,
      logger,
    });
  } catch (error) {
    logger.error(error);
    reply.error(interaction, { content: undefined });
  }
});
