import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
} from 'discord.js';
import { COLORS, confirmationHandlers, createId, Namespace } from 'utils';
import { EventContext } from 'types';

/**
 * Builds the reply options for a confirmation message.
 * The key is used to determine the confirmation handler to use.
 * If no embeds are provided in the reply options, a default embed will be added.
 * @param key - The key for the confirmation handler.
 * @param opts - The options for the confirmation message (optional).
 * @param args - The arguments to pass to the confirmation handler (optional).
 * @returns The given reply options with an added row of buttons and a default embed if none was provided.
 * @example
 * await interaction.reply(confirmationResponse('example'));
 */
export const confirmationResponse = (
  key: keyof typeof confirmationHandlers,
  opts?: InteractionReplyOptions,
  args?: string[],
): InteractionReplyOptions => {
  const buttonsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(createId(Namespace.Confirmation, 'cancel', key, args))
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId(createId(Namespace.Confirmation, 'confirm', key, args))
      .setLabel('Confirm')
      .setStyle(ButtonStyle.Primary),
  );

  return {
    ...opts,
    components: [...(opts?.components ?? []), buttonsRow],
    embeds: opts?.embeds ??
      [
        new EmbedBuilder().setColor(COLORS.embed).setTitle('Confirmation')
          .setDescription('Are you sure you want to continue?'),
      ],
  };
};

type ConfirmationHandler = (
  /** Whether the confirmation was confirmed or cancelled. */
  confirmed: boolean,
  /** The standard event context. */
  ctx: EventContext,
  /** The button interaction that triggered the confirmation. */
  interaction: ButtonInteraction,
  /** The optional list of arguments passed when creating the confirmation response. */
  args: string[],
) => Promise<void>;

/** Simple function to type check the provided confirmation handler */
export function confirmation(
  handler: ConfirmationHandler,
) {
  return handler;
}
