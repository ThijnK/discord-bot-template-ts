import { Client } from 'discord.js';

export enum MentionType {
  Role = 'role',
  Channel = 'channel',
  User = 'user',
}

/**
 * Create a string that mentions a role, channel, or user
 * @param id The id of the role, channel, or user
 * @param type The type of mention to create
 * @returns The mention string
 */
export const mention = (id: string, type: MentionType): string => {
  switch (type) {
    case MentionType.Role:
      if (id === '@here' || id === '@everyone') return id;
      return `<@&${id}>`;
    case MentionType.Channel:
      return `<#${id}>`;
    case MentionType.User:
      return `<@!${id}>`;
  }
};

mention.role = (id: string) => mention(id, MentionType.Role);
mention.channel = (id: string) => mention(id, MentionType.Channel);
mention.user = (id: string) => mention(id, MentionType.User);

/**
 * Mention an application command of this bot
 *
 * Note that this will only work if the command is registered globally on the bot
 */
mention.command = async (client: Client, name: string) => {
  const command = (await client.application?.commands.fetch())?.find(
    (c) => c.name === name
  );
  if (!command) throw new Error(`Command ${name} not found`);
  return `</${command.name}:${command.id}>`;
};
