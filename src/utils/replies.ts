import {
  InteractionReplyOptions,
  InteractionEditReplyOptions,
  BaseInteraction,
} from 'discord.js';
import { EMOJIS } from '../constants';

export interface DeferableInteraction extends BaseInteraction {
  deferred: boolean;
  replied: boolean;
  reply: (options: InteractionReplyOptions) => Promise<unknown>;
  editReply: (options: InteractionEditReplyOptions) => Promise<unknown>;
}

export enum ReplyType {
  Default = 'default',
  Success = 'success',
  Error = 'error',
  Warn = 'warn',
  Deny = 'deny',
  Wait = 'wait',
}

/**
 * Alter the options to match the reply type
 * @param options The options to alter
 * @param type The type of reply
 * @returns The altered options
 */
const getOptions = (
  options: InteractionReplyOptions | string,
  type: ReplyType
): InteractionReplyOptions => {
  if (typeof options === 'string')
    return getOptions({ content: options }, type);

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
  options: InteractionReplyOptions | string,
  type: ReplyType = ReplyType.Default
) => {
  if (
    !options ||
    (typeof options === 'object' &&
      !options.content &&
      !options.embeds &&
      !options.files)
  )
    return Promise.reject('Cannot send an empty message');

  if (interaction.replied) return Promise.reject('Interaction already replied');

  const alteredOptions = getOptions(options, type);
  if (interaction.deferred) return interaction.editReply(alteredOptions);
  return interaction.reply(alteredOptions);
};

reply.success = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions | string
) => reply(interaction, options, ReplyType.Success);

reply.error = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions | string = 'Oops. Something went wrong!'
) => reply(interaction, options, ReplyType.Error);

reply.warn = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions | string
) => reply(interaction, options, ReplyType.Warn);

reply.deny = <T extends DeferableInteraction>(
  interaction: T,
  options:
    | InteractionReplyOptions
    | string = 'You do not have permission to do that!'
) => reply(interaction, options, ReplyType.Deny);

reply.wait = <T extends DeferableInteraction>(
  interaction: T,
  options: InteractionReplyOptions | string
) => reply(interaction, options, ReplyType.Wait);
