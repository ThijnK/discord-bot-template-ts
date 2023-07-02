// Export as object to enable fast indexing

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
} from 'discord.js';
import helpPaginators from './help';
import { Paginator } from '../../types/paginators';
import { createId, parseId } from '../interaction';
import { COLORS, NAMESPACES } from '../../constants';
import { log } from '../logger';

const _paginators = [...helpPaginators];

const paginators = new Map<string, Paginator>(
  _paginators.map((p) => [p.name, p])
);

// Check if values of paginators map are valid
paginators.forEach((paginator) => {
  if (paginator.pageLength > 25) {
    log.error(
      'paginators',
      `Paginator "${paginator.title}" has a page length greater than 25`
    );
    process.exit(1);
  }
  if (paginator.components && paginator.components.length > 3) {
    log.error(
      'paginators',
      `Paginator "${paginator.title}" has more than 3 components`
    );
    process.exit(1);
  }
});

/**
 * Generate the embed for a specific page of a paginator
 * @param interactionId The interactionId to generate the page for
 * @returns The generated embed
 */
export function generatePage(interactionId: string): InteractionReplyOptions {
  // Extract metadata from interactionId
  const [_namespace, paginatorName, offsetString] = parseId(interactionId);

  const paginator = paginators.get(paginatorName);
  if (!paginator) throw new Error(`Paginator "${paginatorName}" not found`);

  let offset = parseInt(offsetString);
  // Page selected from select menu
  if (offsetString && offsetString.startsWith('select-')) {
    let targetPage = parseInt(offsetString.split('-')[1]);
    if (isNaN(targetPage)) targetPage = 0;
    offset = targetPage * paginator.pageLength;
  }
  if (isNaN(offset)) offset = 0;

  const pageCount = Math.ceil(paginator.getLength() / paginator.pageLength);
  const fields = paginator.getPage(offset);
  const currentPage = Math.floor(offset / paginator.pageLength) + 1;

  const embed = new EmbedBuilder()
    .setTitle(paginator.title)
    .setDescription(paginator.description)
    .setFields(fields)
    .setFooter({
      text: `Page ${currentPage} / ${pageCount}`,
    })
    .setColor(COLORS.embed);

  // Back button
  const backId = createId(
    NAMESPACES.pagination,
    paginatorName,
    offset - paginator.pageLength
  );
  const backButton = new ButtonBuilder()
    .setCustomId(backId)
    .setLabel('Back')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(offset <= 0);

  // Next button
  const nextId = createId(
    NAMESPACES.pagination,
    paginatorName,
    offset + paginator.pageLength
  );
  const nextButton = new ButtonBuilder()
    .setCustomId(nextId)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentPage >= pageCount);

  const selectId = createId(NAMESPACES.pagination, paginatorName);
  const pageSelector = new StringSelectMenuBuilder()
    .setCustomId(selectId)
    .setPlaceholder('Select a page...')
    .setMaxValues(1)
    .setOptions(
      Array.from(Array(pageCount).keys()).map((i) => ({
        label: `Page ${i + 1}`,
        value: i.toString(),
      }))
    );

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    nextButton
  );
  const selectMenu =
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(pageSelector);

  return {
    embeds: [embed],
    components: [buttons, selectMenu, ...(paginator.components ?? [])],
    // Ephemeral by default
    ephemeral: paginator.ephemeral ?? true,
  };
}
