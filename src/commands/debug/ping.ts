import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';

const meta = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Ping the bot for a response.')
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('Provide the bot a message to respond with.')
      .setMinLength(1)
      .setMaxLength(2000)
      .setRequired(false)
  );

export default command(meta, async ({ interaction }) => {
  const message = interaction.options.getString('message');

  throw new Error('Test error');

  return interaction.reply({
    ephemeral: true,
    content: `${message ?? 'Pong!'} (${
      Date.now() - interaction.createdTimestamp
    }ms)`,
  });
});
