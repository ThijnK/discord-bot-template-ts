import { InteractionReplyOptions } from 'discord.js';
import { Paginator } from '../pagination';
import helpPaginators from './help';
import { createId, parseId } from '../interaction';
import { NAMESPACES } from '../../constants';

// Add new paginators here
const paginators: Paginator[] = [...helpPaginators /*, otherPaginator */];

const paginatorMap = new Map<string, Paginator>(
  paginators.map((p) => [p.name, p])
);

/**
 * Generate the embed for a specific page of a paginator
 * @param interactionId The interactionId to generate the page for
 * @returns The generated embed
 */
export function generatePage(interactionId: string): InteractionReplyOptions {
  // Extract metadata from interactionId
  const [_namespace, paginatorName, offsetString] = parseId(interactionId);

  const paginator = paginatorMap.get(paginatorName);
  if (!paginator) throw new Error(`Paginator "${paginatorName}" not found`);

  let offset = parseInt(offsetString);
  // Page selected from select menu
  if (offsetString && offsetString.startsWith('select-')) {
    let targetPage = parseInt(offsetString.split('-')[1]);
    if (isNaN(targetPage)) targetPage = 0;
    offset = targetPage * paginator.pageLength;
  }
  if (isNaN(offset)) offset = 0;

  return paginator.getPage(offset);
}

/**
 * Create a paginated embed for a specific paginator
 * @param paginatorName The name of the paginator to generate the embed for
 * @returns The generated embed
 */
export function paginationEmbed(paginatorName: string) {
  const id = createId(NAMESPACES.pagination, paginatorName);
  return generatePage(id);
}
