import { GuildMember, PermissionFlagsBits } from 'discord.js';
import categories from '../../commands';
import { Command } from '../../types';
import { event, Logger, reply } from '../../utils';

const commands = new Map<string, Command>(
  categories
    .map(({ commands }) => commands.all)
    .flat()
    .map((c) => [c.meta.name, c])
);

export default event('interactionCreate', async ({ client }, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const logger = new Logger(`/${interaction.commandName}`);

  try {
    const command = commands.get(interaction.commandName);

    if (!command)
      throw new Error(`Command "${interaction.commandName}" not found`);

    // If the command is marked as adminOnly, check if the user is an admin
    if (
      command.options.adminOnly &&
      !(interaction.member as GuildMember).permissions.has(
        PermissionFlagsBits.Administrator
      )
    )
      return reply.deny(interaction);

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
