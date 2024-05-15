import {
  Awaitable,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  APIEmbedField,
  SlashCommandSubcommandsOnlyBuilder,
  AutocompleteInteraction,
} from 'discord.js';
import { BaseContext } from './context';

export interface CommandContext extends BaseContext {
  interaction: ChatInputCommandInteraction;
}

export interface AutocompleteContext extends BaseContext {
  interaction: AutocompleteInteraction;
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
   * When defined, this command will be on cooldown for the given number of seconds after being used.
   *
   * By default, it is on a per-user basis, but that can be changed to guild-wide by setting the scope to `guild`.
   *
   * Server admins will automatically bypass the cooldown.
   * @default undefined
   */
  cooldown?:
    | number
    | {
        /**
         * The number of seconds this command will be on cooldown for.
         */
        seconds: number;
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
};
export type CommandExec = (ctx: CommandContext) => Awaitable<unknown>;
export type CommandAutcomplete = (
  ctx: AutocompleteContext
) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  | SlashCommandSubcommandsOnlyBuilder;
export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
  autocomplete?: CommandAutcomplete;
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
