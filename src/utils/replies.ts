import {
  InteractionReplyOptions,
  InteractionEditReplyOptions,
  BaseInteraction,
} from 'discord.js';
import { EMOJIS } from '../constants';
import { log } from './logger';

interface DeferableInteraction extends BaseInteraction {
  deferred: boolean;
  reply: (options: InteractionReplyOptions) => Promise<unknown>;
  editReply: (options: InteractionEditReplyOptions) => Promise<unknown>;
}

export enum ReplyType {
  Default = 'default',
  Error = 'error',
  Warn = 'warn',
  Deny = 'deny',
}

/**
 * Alter the options to match the reply type
 * @param options The options to alter
 * @param type The type of reply
 * @returns The altered options
 */
const getOptions = (options: InteractionReplyOptions, type: ReplyType) => {
  const { content, ephemeral } = options;
  const emoji = type === ReplyType.Default ? '' : EMOJIS[type];

  return {
    ...options,
    content: content ? `${emoji} ${content}` : undefined,
    // By default, replies are ephemeral
    ephemeral: ephemeral ?? true,
  };
};

/**
 * Reply to an interaction
 * @param interaction The interaction to reply to
 * @param options The options to reply with
 * @param type The type of reply
 */
export const reply = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions,
  type: ReplyType = ReplyType.Default
) => {
  if (!options.content && !options.embeds && !options.files)
    return log.error('reply', 'Cannot send an empty message');

  const alteredOptions = getOptions(options, type);
  if (interaction.deferred) return interaction.editReply(alteredOptions);
  return interaction.reply(alteredOptions);
};

reply.error = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions = {
    content: 'Oops. Something went wrong!',
  }
) => reply(interaction, options, ReplyType.Error);

reply.warn = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions
) => reply(interaction, options, ReplyType.Warn);

reply.deny = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions = {
    content: 'You do not have permission to do that!',
  }
) => reply(interaction, options, ReplyType.Deny);
