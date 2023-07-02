import { createId, event, generatePage, parseId, reply } from '../../utils';
import { NAMESPACES } from '../../constants';

export default event('interactionCreate', async ({ logger }, interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
  const [namespace, paginatorName] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.pagination) return;

  try {
    await interaction.deferUpdate();
    let interactionId = interaction.customId;
    if (interaction.isStringSelectMenu())
      interactionId = createId(
        namespace,
        paginatorName,
        `select-${interaction.values[0]}`
      );

    return await interaction.editReply(generatePage(interactionId));
  } catch (error) {
    logger.error(error);
    reply.error(interaction);
  }
});
