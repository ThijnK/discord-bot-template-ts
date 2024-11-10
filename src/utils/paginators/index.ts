import { InteractionReplyOptions } from 'discord.js';
import { Paginator } from '../pagination.ts';
import helpPaginators from './help.ts';
import { createId, parseId } from '../interaction.ts';
import { Namespace } from 'utils';
import { PaginationContext } from 'types';

// Add new paginators here
// If they need to be initialized, add them to the initPaginators function
const paginators: Paginator[] = [];

const paginatorMap = new Map<string, Paginator>(
  paginators.map((p) => [p.name, p]),
);

export function initPaginators() {
  for (const paginator of helpPaginators()) {
    paginatorMap.set(paginator.name, paginator);
  }
}

/**
 * Generate the embed for a specific page of a paginator
 * @param interactionId The interactionId to generate the page for
 * @returns The generated embed
 */
export function generatePage(
  interactionId: string,
  ctx: PaginationContext,
): Promise<InteractionReplyOptions> {
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

  return paginator.getPage(offset, ctx);
}

/**
 * Create a paginated reply for a specific paginator
 * @param paginatorName The name of the paginator to generate the reply for
 * @returns The generated reply options
 */
export function paginationReply(paginatorName: string, ctx: PaginationContext) {
  const id = createId(Namespace.Pagination, paginatorName);
  return generatePage(id, ctx);
}
