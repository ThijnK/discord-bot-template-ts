import commands from '../../commands';
import { Command } from '../../types';
import { EditReply, event, Logger, Reply } from '../../utils';

const allCommands = commands.map(({ commands }) => commands).flat();
const allCommandsMap = new Map<string, Command>(
  allCommands.map((c) => [c.meta.name, c])
);

export default event('interactionCreate', async ({ client }, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const logger = new Logger(`/${interaction.commandName}`);

  try {
    const command = allCommandsMap.get(interaction.commandName);

    if (!command) throw new Error(`Command not found`);

    await command.exec({
      client,
      interaction,
      logger,
    });
  } catch (error) {
    logger.error(error);

    if (interaction.deferred)
      return interaction.editReply(EditReply.error('Something went wrong :('));

    return interaction.reply(Reply.error('Something went wrong :('));
  }
});
