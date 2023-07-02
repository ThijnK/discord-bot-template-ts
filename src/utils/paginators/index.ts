// Export as object to enable fast indexing

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
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
  if (paginator.components && paginator.components.length > 4) {
    log.error(
      'paginators',
      `Paginator "${paginator.title}" has more than 4 components`
    );
    process.exit(1);
  }
});

export const Actions = {
  next: '+',
  back: '-',
};

/**
 * Generate the embed for a specific page of a paginator
 * @param interactionId The interactionId to generate the page for
 * @returns The generated embed
 */
export function generatePage(interactionId: string): InteractionReplyOptions {
  // Extract metadata from interactionId
  const [_namespace, paginatorName, action, currentOffset] =
    parseId(interactionId);

  const paginator = paginators.get(paginatorName);
  if (!paginator) throw new Error(`Paginator "${paginatorName}" not found`);

  let offset = parseInt(currentOffset);
  if (isNaN(offset)) offset = 0;

  // Update offset based on action (if provided)
  if (action === Actions.next) offset += paginator.pageLength;
  else if (action === Actions.back) offset -= paginator.pageLength;

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
    Actions.back,
    offset
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
    Actions.next,
    offset
  );
  const nextButton = new ButtonBuilder()
    .setCustomId(nextId)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(currentPage >= pageCount);

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    nextButton
  );

  return {
    embeds: [embed],
    components: [component, ...(paginator.components ?? [])],
    // Ephemeral by default
    ephemeral: paginator.ephemeral ?? true,
  };
}
