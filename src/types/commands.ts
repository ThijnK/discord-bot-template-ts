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
   * When set to `true`, this command will be registered only in the `TEST_GUILD` defined in the .env.
   * @default false
   */
  private?: boolean;
  /**
   * When set to `true`, only admins in the server will be allowed to use this command.
   * @default false
   */
  adminOnly?: boolean;
  /**
   * When defined, this command will be on cooldown for the given number of seconds.
   *
   * On a per-user basis by default, which can be changed to guild-wide by setting the scope to `guild`.
   * @default undefined
   *
   * @see `rateLimit` option for more fine-tuned control.
   */
  cooldown?:
    | number
    | {
        /**
         * The number of seconds this command will be on cooldown for.
         * @default 5
         */
        seconds?: number;
        /**
         * The scope of the cooldown.
         * @default user
         *
         * @values
         * `user` - The cooldown will be on a per-user basis.
         *
         * `guild` - The cooldown will be on a per-guild basis.
         */
        scope?: 'user' | 'guild';
      };
  /**
   * When defined, this command will be rate limited on a per-user basis.
   *
   * On a per-user basis by default, which can be changed to guild-wide by setting the scope to `guild`.
   * @default undefined
   */
  rateLimit?: {
    /**
     * The number of times this command can be used in the given time period.
     * @default 1
     */
    times?: number;
    /**
     * The time period in seconds.
     * @default 5
     */
    period?: number;
    /**
     * The scope of the rate limit.
     * @default user
     *
     * @values
     * `user` - The rate limit will be on a per-user basis.
     *
     * `guild` - The rate limit will be on a per-guild basis.
     */
    scope?: 'user' | 'guild';
  };
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

export interface CommandCategoryCommands {
  public: Command[];
  private: Command[];
  all: Command[];
}

export interface CommandCategoryMetadata {
  name: string;
  description?: string;
  emoji?: string;
}
export interface CommandCategory extends CommandCategoryMetadata {
  commands: CommandCategoryCommands;
}
/** Fields for each category page */
export interface CommandCategoryPage extends CommandCategoryMetadata {
  length: number;
  fields: APIEmbedField[][];
}
