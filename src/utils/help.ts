import {
  ActionRowBuilder,
  BaseInteraction,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
} from "discord.js";
import { NAMESPACES } from "utils";
import { createId } from "./interaction.ts";
import categories from "commands";
import ENV from "env";
import { CommandCategoryCommands } from "types";

/**
 * Filters categories to exclude ones that do not contain commands relevant to the user
 * @param cmdType The type of command to filter for
 * @param isAdmin Whether the user is an admin
 * @returns An array of categories that contain commands relevant to the user
 */
const filterCategories = (
  cmdType: keyof CommandCategoryCommands,
  isAdmin = false
) =>
  categories?.filter((c) =>
    c.commands[cmdType].some((cmd) => !cmd.options.adminOnly || isAdmin)
  );

/** Pre-filtered command categories */
const cats = {
  private: {
    member: filterCategories("all"),
    admin: filterCategories("all", true),
  },
  public: {
    member: filterCategories("public"),
    admin: filterCategories("public", true),
  },
};

/** Select menu for the help embed */
export const helpSelectComponent = (
  interaction: BaseInteraction
): ActionRowBuilder<StringSelectMenuBuilder> | null => {
  const isAdmin =
    interaction.memberPermissions &&
    interaction.memberPermissions.has(PermissionFlagsBits.Administrator);
  // Categories specific to this guild (test guild or not)
  const guildCats =
    interaction.guildId === ENV.TEST_GUILD ? cats.private : cats.public;

  if (guildCats[isAdmin ? "admin" : "member"].length === 0) return null;

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(createId(NAMESPACES.help))
      .setPlaceholder("Select a category...")
      .setMaxValues(1)
      .addOptions(
        guildCats[isAdmin ? "admin" : "member"].map(
          ({ name, description, emoji }) => ({
            label: name,
            description,
            emoji,
            value: name,
          })
        )
      )
  );
};
