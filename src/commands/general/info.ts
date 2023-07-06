import {
  EmbedBuilder,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { command, formatDate, reply } from '../../utils';
import { COLORS } from '../../constants';
import { CommandProps } from '../../types';

const server = new SlashCommandSubcommandBuilder()
  .setName('server')
  .setDescription('Get some info about this server.');

const bot = new SlashCommandSubcommandBuilder()
  .setName('bot')
  .setDescription('Get some info about this bot.');

const user = new SlashCommandSubcommandBuilder()
  .setName('user')
  .setDescription('Get some info about a user.')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The user to get info about.')
      .setRequired(true)
  );

const meta = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get some info about various things.')
  .addSubcommand(server)
  .addSubcommand(bot)
  .addSubcommand(user);

export default command(
  { meta, private: true },
  async ({ interaction, ...props }) => {
    await interaction.deferReply({ ephemeral: true });

    switch (interaction.options.getSubcommand()) {
      case 'server':
        return await getServerInfo({ interaction, ...props });
      case 'bot':
        return await getBotInfo({ interaction, ...props });
      case 'user':
        return await getUserInfo({ interaction, ...props });
    }
  }
);

const getServerInfo = async ({ interaction }: CommandProps) => {
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
        value: interaction.guild
          ? formatDate(interaction.guild?.createdAt)
          : 'Unknown',
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

  await reply(interaction, { embeds: [embed] });
};

const getBotInfo = async ({ interaction }: CommandProps) => {
  const embed = new EmbedBuilder()
    .setTitle('Bot Info')
    .setDescription(`Info about ***${interaction.client.user?.username}***`)
    .setColor(COLORS.embed)
    .setThumbnail(interaction.client.user?.avatarURL() ?? '')
    .setFields([
      {
        name: 'Bot ID',
        value: interaction.client.user?.id ?? 'Unknown',
        inline: false,
      },
      {
        name: 'Created',
        value: formatDate(interaction.client.user?.createdAt) ?? 'Unknown',
        inline: true,
      },
      {
        name: 'Guilds',
        value: interaction.client.guilds.cache.size?.toString() ?? 'Unknown',
        inline: true,
      },
    ]);

  await reply(interaction, { embeds: [embed] });
};

const getUserInfo = async ({ interaction }: CommandProps) => {
  const user = interaction.options.getUser('user', true);
  const member = await interaction.guild?.members.fetch(user.id);
  if (!member) reply.error(interaction, { content: 'User not found' });

  const embed = new EmbedBuilder()
    .setTitle('User Info')
    .setDescription(`Info about ***${user.username}***`)
    .setColor(COLORS.embed)
    .setThumbnail(user.avatarURL() ?? '')
    .setFields([
      {
        name: 'User ID',
        value: user.id ?? 'Unknown',
        inline: false,
      },
      {
        name: 'Created',
        value: formatDate(user.createdAt) ?? 'Unknown',
        inline: true,
      },
      {
        name: 'Joined',
        value:
          member && member.joinedAt ? formatDate(member.joinedAt) : 'Unknown',
        inline: true,
      },
    ]);

  await reply(interaction, { embeds: [embed] });
};
