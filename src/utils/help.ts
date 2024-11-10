import {
  ActionRowBuilder,
  BaseInteraction,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
} from 'discord.js';
import { Namespace } from 'utils';
import { createId } from './interaction.ts';
import categories from 'commands';
import ENV from 'env';
import { CommandCategory, CommandCategoryCommands } from 'types';

/**
 * Filters categories to exclude ones that do not contain commands relevant to the user
 * @param cmdType The type of command to filter for
 * @param isAdmin Whether the user is an admin
 * @returns An array of categories that contain commands relevant to the user
 */
const filterCategories = (
  cmdType: keyof CommandCategoryCommands,
  isAdmin = false,
) =>
  categories?.filter((c) =>
    c.commands[cmdType].some((cmd) => !cmd.options.adminOnly || isAdmin)
  );

/** Cached filtered command categories */
// deno-lint-ignore prefer-const
let cats = {
  private: {
    member: null as null | CommandCategory[],
    admin: null as null | CommandCategory[],
  },
  public: {
    member: null as null | CommandCategory[],
    admin: null as null | CommandCategory[],
  },
};
const getCategories = (
  scope: 'private' | 'public',
  access: 'admin' | 'member',
) => {
  if (!cats[scope][access]) {
    cats[scope][access] = filterCategories(
      scope === 'private' ? 'all' : 'public',
      access === 'admin',
    );
  }
  return cats[scope][access];
};

/** Select menu for the help embed */
export const helpSelectComponent = (
  interaction: BaseInteraction,
): ActionRowBuilder<StringSelectMenuBuilder> | null => {
  const isAdmin = interaction.memberPermissions &&
    interaction.memberPermissions.has(PermissionFlagsBits.Administrator);

  // Categories specific to this guild (test guild or not)
  const guildCats = getCategories(
    interaction.guildId === ENV.TEST_GUILD ? 'private' : 'public',
    isAdmin ? 'admin' : 'member',
  );
  if (guildCats.length === 0) return null;

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(createId(Namespace.Help))
      .setPlaceholder('Select a category...')
      .setMaxValues(1)
      .addOptions(
        guildCats.map(({ name, description, emoji }) => ({
          label: name,
          description,
          emoji,
          value: name,
        })),
      ),
  );
};
