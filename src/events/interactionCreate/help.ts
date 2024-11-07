import { event, paginationReply, parseId, NAMESPACES } from "utils";

export default event("interactionCreate", async (ctx, interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.help) return;

  await interaction.deferUpdate();
  return await interaction.editReply(
    await paginationReply(interaction.values[0], {
      ...ctx,
      interaction,
    })
  );
});
