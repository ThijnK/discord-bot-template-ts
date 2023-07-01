import { getCategoryPage, getCategoryRoot, Namespaces } from '../../pages/help';
import { createId, EditReply, event, readId, Reply } from '../../utils';

export default event('interactionCreate', async ({ logger }, interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
  const [namespace] = readId(interaction.customId);

  // If namespace not in help pages stop
  if (!Object.values(Namespaces).includes(namespace)) return;

  try {
    await interaction.deferUpdate();

    switch (namespace) {
      case Namespaces.root:
        return await interaction.editReply(getCategoryRoot());
      case Namespaces.select:
        if (!interaction.isStringSelectMenu()) return;
        const newId = createId(Namespaces.select, interaction.values[0]);
        return await interaction.editReply(getCategoryPage(newId));
      case Namespaces.action:
        return await interaction.editReply(
          getCategoryPage(interaction.customId)
        );

      default:
        throw new Error('Invalid namespace reached...');
    }
  } catch (error) {
    logger.error(error);

    if (interaction.deferred)
      return interaction.editReply(EditReply.error('Something went wrong :('));

    return interaction.reply(Reply.error('Something went wrong :('));
  }
});
