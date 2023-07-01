import {
  Awaitable,
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { Logger } from '../utils';

export interface CommandProps {
  interaction: ChatInputCommandInteraction;
  client: Client;
  logger: Logger;
}

export type CommandExec = (props: CommandProps) => Awaitable<unknown>;
export type CommandMeta =
  | SlashCommandBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export interface Command {
  meta: CommandMeta;
  exec: CommandExec;
}

export interface CommandCategoryExtra {
  description?: string;
  emoji?: string;
}

export interface CommandCategory extends CommandCategoryExtra {
  name: string;
  commands: Command[];
}
