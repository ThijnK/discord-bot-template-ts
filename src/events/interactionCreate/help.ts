import { createId, event, generatePage, parseId, reply } from '../../utils';
import { NAMESPACES } from '../../constants';

export default event('interactionCreate', async ({ logger }, interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.help) return;

  try {
    await interaction.deferUpdate();
    const newId = createId(NAMESPACES.pagination, interaction.values[0]);
    return await interaction.editReply(generatePage(newId));
  } catch (error) {
    logger.error(error);
    reply.error(interaction);
  }
});
