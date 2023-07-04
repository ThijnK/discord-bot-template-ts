import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { command, helpSelectComponent } from '../../utils';
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

  return await interaction.reply({
    embeds: [embed],
    components: [helpSelectComponent],
    ephemeral: true,
  });
});
