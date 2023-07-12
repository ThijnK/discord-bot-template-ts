import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { command, helpSelectComponent, reply } from '../../utils';
import { COLORS } from '../../constants';

const meta = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get a list of all commands for the bot.');

export default command({ meta }, async ({ interaction }) => {
  const embed = new EmbedBuilder()
    .setTitle('Help Menu')
    .setDescription(
      'Browse through all available commands by selecting a category below.'
    )
    .setColor(COLORS.embed);

  const helpSelectMenu = helpSelectComponent(interaction);
  if (!helpSelectMenu) {
    embed.setDescription(
      'There are no commands available for you to use in this server.'
    );
    return await reply(interaction, {
      embeds: [embed],
      ephemeral: true,
    });
  }

  return await reply(interaction, {
    embeds: [embed],
    components: [helpSelectMenu],
    ephemeral: true,
  });
});
