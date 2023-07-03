import { event, paginationEmbed, parseId, reply } from '../../utils';
import { NAMESPACES } from '../../constants';

export default event('interactionCreate', async ({ logger }, interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.help) return;

  try {
    await interaction.deferUpdate();
    return await interaction.editReply(paginationEmbed(interaction.values[0]));
  } catch (error) {
    logger.error(error);
    reply.error(interaction);
  }
});
