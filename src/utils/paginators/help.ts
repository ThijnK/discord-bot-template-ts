import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from 'discord.js';
import categories from '../../commands';
import { Command, PaginationData } from '../../types';
import { helpSelectComponent } from '../help';
import { Paginator } from '../pagination';

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
  const result = command.meta.options
    .map((option) =>
      extractSubcommandsRecursive(
        option.toJSON(),
        command.meta.name,
        command.options.adminOnly
      )
    )
    .flat();

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

const helpPaginators: Paginator[] =
  categories?.map((category) => {
    const cmds = category.commands.public.sort((a, b) =>
      a.meta.name.localeCompare(b.meta.name)
    );
    const member = cmds
      .filter((c) => !c.options.adminOnly)
      .map((c) => getCommands(c))
      .flat();
    const admin = cmds.map((c) => getCommands(c)).flat();
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
      replyOptions: {
        components: [helpSelectComponent],
      },
      pageLength: 10,
      getData: async ({ interaction }) => {
        if (
          interaction.memberPermissions &&
          interaction.memberPermissions.has(PermissionFlagsBits.Administrator)
        )
          return admin;
        return member;
      },
    });
  }) ?? [];

export default helpPaginators;
