import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { command, formatDate } from '../../utils';
import { COLORS } from '../../constants';

const meta = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get some info about this server.');

export default command({ meta }, async ({ interaction }) => {
  await interaction.deferReply({ ephemeral: true });
  const owner = await interaction.guild?.fetchOwner();
  const channels = await interaction.guild?.channels.fetch();

  const embed = new EmbedBuilder()
    .setTitle('Server Info')
    .setDescription(`Info about ***${interaction.guild?.name}***`)
    .setColor(COLORS.embed)
    .setThumbnail(interaction.guild?.iconURL() ?? '')
    .setFields([
      {
        name: 'Guild ID',
        value: interaction.guildId ?? 'Unknown',
        inline: false,
      },
      {
        name: 'Owner',
        value: owner?.user.username ?? 'Unknown',
        inline: true,
      },
      {
        name: 'Created',
        value: formatDate(interaction.createdAt),
        inline: true,
      },
      {
        name: 'Members',
        value: interaction.guild?.memberCount?.toString() ?? 'Unknown',
        inline: true,
      },
      {
        name: 'Channels',
        value: channels?.size?.toString() ?? 'Unknown',
        inline: true,
      },
      {
        name: 'Roles',
        value: interaction.guild?.roles.cache.size?.toString() ?? 'Unknown',
        inline: true,
      },
    ]);

  return interaction.editReply({
    embeds: [embed],
  });
});
