import { event, Namespace, paginationReply, parseId } from 'utils';

export default event('interactionCreate', async (ctx, interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== Namespace.Help) return;

  await interaction.deferUpdate();
  return await interaction.editReply(
    await paginationReply(interaction.values[0], {
      ...ctx,
      interaction,
    }),
  );
});
