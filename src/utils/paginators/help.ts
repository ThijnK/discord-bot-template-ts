import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType,
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
  name: string
): PaginationData => {
  const result: PaginationData = [];
  if (option.type === ApplicationCommandOptionType.Subcommand)
    result.push({
      name: `/${name} ${option.name}`,
      value: option.description,
    });
  else if (option.type === ApplicationCommandOptionType.SubcommandGroup)
    option.options?.forEach((sub) =>
      result.push(...extractSubcommandsRecursive(sub, `${name} ${option.name}`))
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
      extractSubcommandsRecursive(option.toJSON(), command.meta.name)
    )
    .flat();

  // If no subcommands are found, this command is a standalone command
  if (result.length === 0)
    result.push({
      name: `/${command.meta.name}`,
      value: command.meta.description,
    });
  return result;
};

const helpPaginators: Paginator[] =
  categories?.map((category) => {
    const items = category.commands.public.map((c) => getCommands(c)).flat();
    const emoji = category.emoji ? `${category.emoji} ` : '';

    return new Paginator(category.name, {
      embedData: {
        title: `${emoji}${category.name} Commands`,
        description: `Browse through ${
          category.commands.public.length
        } command${category.commands.public.length > 1 ? 's' : ''} in ${emoji}${
          category.name
        }`,
      },
      replyOptions: {
        components: [helpSelectComponent],
      },
      pageLength: 10,
      getData: async () => items,
    });
  }) ?? [];

export default helpPaginators;
