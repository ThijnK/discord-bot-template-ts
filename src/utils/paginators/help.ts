import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from 'discord.js';
import categories from '../../commands';
import { Command, CommandCategoryCommands, PaginationData } from '../../types';
import { helpSelectComponent } from '../help';
import { Paginator } from '../pagination';
import { ENV } from '../../env';

/**
 * Extracts subcommands from a command option recursively
 * @param option The option to extract subcommands from
 * @param name The name of the command, including parent (subcommand group) names
 * @returns An array of embed fields for each subcommand, comprising the name and description of the subcommand
 */
const extractSubcommandsRecursive = (
  option: APIApplicationCommandOption,
  name: string,
  adminOnly = false
): PaginationData => {
  const result: PaginationData = [];
  if (option.type === ApplicationCommandOptionType.Subcommand)
    result.push({
      name: `/${name} ${option.name}`,
      value: `
        ${option.description}
        ${adminOnly ? '🛡️ _admin only_' : ''}
      `,
    });
  else if (option.type === ApplicationCommandOptionType.SubcommandGroup)
    option.options?.forEach((sub) =>
      result.push(
        ...extractSubcommandsRecursive(sub, `${name} ${option.name}`, adminOnly)
      )
    );
  return result;
};

/**
 * Gets all (sub)command names and descriptions for a given command
 * @param command The command to get subcommands for
 * @returns An array of embed fields for each command, comprising the name and description of the command
 */
const getCommands = (command: Command): PaginationData => {
  const result = command.meta.options.flatMap((option) =>
    extractSubcommandsRecursive(
      option.toJSON(),
      command.meta.name,
      command.options.adminOnly
    )
  );

  // If no subcommands are found, this command is a standalone command
  if (result.length === 0)
    result.push({
      name: `/${command.meta.name}`,
      value: `
        ${command.meta.description}
        ${command.options.adminOnly ? '🛡️ _admin only_' : ''}
      `,
    });
  return result;
};

const filterCommands = (
  commands: CommandCategoryCommands,
  type: keyof CommandCategoryCommands,
  isAdmin = false
) =>
  commands[type]
    .sort((a, b) => a.meta.name.localeCompare(b.meta.name))
    .filter((c) => !c.options.adminOnly || isAdmin)
    .flatMap((c) => getCommands(c));

const helpPaginators: Paginator[] =
  categories?.map((category) => {
    const cmds = {
      private: {
        member: filterCommands(category.commands, 'private'),
        admin: filterCommands(category.commands, 'private', true),
      },
      public: {
        member: filterCommands(category.commands, 'public'),
        admin: filterCommands(category.commands, 'public', true),
      },
    };
    const emoji = category.emoji ? `${category.emoji} ` : '';

    return new Paginator(category.name, {
      embedData: {
        title: `${emoji}${category.name} Commands`,
        description:
          category.description ??
          `Browse through ${category.commands.public.length} command${
            category.commands.public.length > 1 ? 's' : ''
          } in ${emoji}${category.name}`,
      },
      replyOptions: ({ interaction }) => ({
        components: [helpSelectComponent(interaction)],
      }),
      pageLength: 10,
      getData: async ({ interaction }) => {
        const guildCmds =
          interaction.guildId === ENV.TEST_GUILD ? cmds.private : cmds.public;
        if (
          interaction.memberPermissions &&
          interaction.memberPermissions.has(PermissionFlagsBits.Administrator)
        )
          return guildCmds.admin;
        return guildCmds.member;
      },
    });
  }) ?? [];

export default helpPaginators;
