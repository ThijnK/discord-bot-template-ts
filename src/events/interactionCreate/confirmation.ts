import { confirmationHandlers, EMOJIS, event, Namespace, parseId } from 'utils';

export default event('interactionCreate', async (ctx, interaction) => {
  if (!interaction.isButton()) return;
  const [namespace, action, key, ...args] = parseId(interaction.customId);
  if (namespace !== Namespace.Confirmation) return;

  const confirmed = action === 'confirm';
  if (key in confirmationHandlers) {
    await confirmationHandlers[key as keyof typeof confirmationHandlers](
      confirmed,
      ctx,
      interaction,
      args,
    );
  } else {
    await interaction.deferUpdate();
    await interaction.editReply({
      content: `${EMOJIS.error} Oops. Something went wrong!`,
      embeds: [],
      components: [],
    });
  }
});
