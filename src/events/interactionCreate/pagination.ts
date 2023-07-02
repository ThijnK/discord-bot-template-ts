import { event, generatePage, parseId, reply } from '../../utils';
import { NAMESPACES } from '../../constants';

export default event('interactionCreate', async ({ logger }, interaction) => {
  if (!interaction.isButton()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.pagination) return;

  try {
    await interaction.deferUpdate();
    return await interaction.editReply(generatePage(interaction.customId));
  } catch (error) {
    logger.error(error);
    reply.error(interaction);
  }
});
