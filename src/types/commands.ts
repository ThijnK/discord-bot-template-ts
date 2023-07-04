import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  APIEmbedField,
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
  private: boolean;
};
export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
  options?: CommandOptions;
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
