import {
  CommandInteraction,
  GuildMember,
  PermissionFlagsBits,
} from "discord.js";
import categories from "commands";
import { Command, CommandOptions } from "types";
import { event, Logger, reply } from "utils";

const commands = new Map<string, Command>(
  categories
    .map(({ commands }) => commands.all)
    .flat()
    .map((c) => [c.meta.name, c])
);

const cooldowns = new Map<string, Map<string, number>>();

export default event("interactionCreate", async ({ client }, interaction) => {
  if (interaction.isChatInputCommand()) {
    const logger = new Logger(`/${interaction.commandName}`);
    const command = commands.get(interaction.commandName);

    if (!command) {
      logger.error(`Command ${interaction.commandName} not found.`);
      return await reply.error(interaction, "Command not found.");
    }

    const { adminOnly, cooldown } = command.options;
    const isAdmin = (interaction.member as GuildMember).permissions.has(
      PermissionFlagsBits.Administrator
    );

    // If the command is marked as adminOnly, check if the user is an admin
    if (adminOnly && !isAdmin) return await reply.deny(interaction);

    // Check the cooldown for the command, if enabled
    const cooldownError = checkCooldown(cooldown, interaction, isAdmin);
    if (cooldownError) return await reply.wait(interaction, cooldownError);

    await command.exec({
      client,
      interaction,
      logger,
    });
  } else if (interaction.isAutocomplete()) {
    const logger = new Logger(`/${interaction.commandName}`);
    const command = commands.get(interaction.commandName);

    if (!command)
      return logger.error(`Command ${interaction.commandName} not found.`);

    if (!command.autocomplete)
      return logger.error(
        `Missing autocomplete handler for ${interaction.commandName}.`
      );

    await command.autocomplete({
      client,
      interaction,
      logger,
    });
  }
});

const checkCooldown = (
  cooldown: CommandOptions["cooldown"],
  interaction: CommandInteraction,
  isAdmin: boolean
) => {
  if (!cooldown) return null;

  const seconds = typeof cooldown === "number" ? cooldown : cooldown.seconds;
  const scope = typeof cooldown === "number" ? "user" : cooldown.scope;

  if (!interaction.guildId) return null;

  const now = Date.now();
  const timestamps =
    cooldowns.get(interaction.commandName) ?? new Map<string, number>();
  const timestamp =
    timestamps.get(
      scope === "user" ? interaction.user.id : interaction.guildId
    ) ?? 0;
  const cooldownEnd = timestamp + seconds * 1000;

  if (now < cooldownEnd && !isAdmin)
    return `Command will be available <t:${Math.floor(cooldownEnd / 1000)}:R>.`;

  timestamps.set(
    scope === "user" ? interaction.user.id : interaction.guildId,
    now
  );

  cooldowns.set(interaction.commandName, timestamps);
  return null;
};
