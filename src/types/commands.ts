import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  APIEmbedField,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import { Logger } from '../utils';

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  logger: Logger;
}

export type CommandOptions = {
  /**
   * When set to `true`, this command will be registered only in the `TEST_GUILD` defined in the .env
   * @default false
   */
  private?: boolean;
  /**
   * When set to `true`, only admins in the server will be allowed to use this command
   * @default false
   */
  adminOnly?: boolean;
};
export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | SlashCommandSubcommandsOnlyBuilder;
export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
  options: CommandOptions;
}

export interface CommandCategoryMetadata {
  name: string;
  description?: string;
  emoji?: string;
}
export interface CommandCategory extends CommandCategoryMetadata {
  commands: {
    public: Command[];
    private: Command[];
    all: Command[];
  };
}
/** Fields for each category page */
export interface CommandCategoryPage extends CommandCategoryMetadata {
  length: number;
  fields: APIEmbedField[][];
}
