import { SlashCommandBuilder } from 'discord.js';
import { command, reply } from '../../utils';

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

export default command({
  meta,
  private: true,
  exec: async ({ client, interaction }) => {
    const message = interaction.options.getString('message');

    await reply(interaction, {
      ephemeral: true,
      content: `${message ?? 'Pong!'} (${client.ws.ping}ms)`,
    });
  },
});
