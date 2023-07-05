import { event, paginationEmbed, parseId } from '../../utils';
import { NAMESPACES } from '../../constants';

export default event('interactionCreate', async (_props, interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  const [namespace] = parseId(interaction.customId);
  if (namespace !== NAMESPACES.help) return;

  await interaction.deferUpdate();
  return await interaction.editReply(paginationEmbed(interaction.values[0]));
});
