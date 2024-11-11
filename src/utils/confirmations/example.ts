import { confirmation } from 'utils';

export default confirmation(
  // confirmed indicates whether the confirmation was confirmed or cancelled.
  // ctx contains the context with the bot client, etc.
  // interaction is the interaction that triggered the confirmation (button click).
  // args is the list of arguments passed to the confirmation handler (optional).
  async (confirmed, _ctx, interaction, _args) => {
    // This example just edits the message that contains the confirmation embed
    // to show a message indicating whether the confirmation was confirmed or cancelled.
    await interaction.deferUpdate();
    await interaction.editReply({
      content: confirmed ? 'Confirmed!' : 'Cancelled!',
      embeds: [],
      components: [],
    });
  },
);
