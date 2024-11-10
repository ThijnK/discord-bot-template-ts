import { createId, event, generatePage, Namespace, parseId } from 'utils';

export default event('interactionCreate', async (ctx, interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
  const [namespace, paginatorName] = parseId(interaction.customId);
  if (namespace !== Namespace.Pagination) return;

  await interaction.deferUpdate();
  let interactionId = interaction.customId;
  if (interaction.isStringSelectMenu()) {
    interactionId = createId(
      namespace,
      paginatorName,
      `select-${interaction.values[0]}`,
    );
  }

  return await interaction.editReply(
    await generatePage(interactionId, { ...ctx, interaction }),
  );
});
