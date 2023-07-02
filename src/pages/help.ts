import {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} from '@discordjs/builders';
import {
  APIEmbedField,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import CategoryRoot from '../commands';
import { chunk, createId, readId } from '../utils';
import { COLORS } from '../constants';

// Namespace identifiers
export const Namespaces = {
  root: 'help_category_root',
  select: 'help_category_select',
  action: 'help_category_action',
};

// Action identifiers
export const Actions = {
  next: '+',
  back: '-',
};

const N = Namespaces;
const A = Actions;

/**
 * Generate new embed for root category page
 * @param ephemeral Whether the reply should be ephemeral
 * @returns The generated embed
 */
export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
  // Add option for each category
  const options = CategoryRoot.map(
    ({ name, description, emoji }) =>
      new StringSelectMenuOptionBuilder({
        label: name,
        description,
        emoji,
        value: name,
      })
  );

  const embed = new EmbedBuilder()
    .setTitle('Help Menu')
    .setDescription('Browse through all commands.')
    .setColor(COLORS.embed);

  const selectId = createId(N.select);
  const select = new SelectMenuBuilder()
    .setCustomId(selectId)
    .setPlaceholder('Command Category')
    .setMaxValues(1)
    .setOptions(options);

  const component = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
    select
  );

  return {
    embeds: [embed],
    components: [component],
    ephemeral,
  };
}

/**
 * Generate new embed for category page
 * @param interactionId The interactionId to generate the page for
 * @returns The generated embed
 */
export function getCategoryPage(
  interactionId: string
): InteractionReplyOptions {
  // Extract metadata from interactionId
  const [_namespace, categoryName, action, currentOffset] =
    readId(interactionId);

  const category = CategoryRoot.find(({ name }) => name === categoryName);
  if (!category)
    throw new Error(
      'Invalid interactionId; Failed to find corresponding category page!'
    );

  // Create embed fields from commands, chunked into groups of 10
  const fields: APIEmbedField[][] = chunk(
    category.commands.map((c) => ({
      name: `/${c.meta.name}`,
      value: c.meta.description,
    })),
    10
  );

  let offset = parseInt(currentOffset);
  if (isNaN(offset)) offset = 0;

  // Update offset based on action
  if (action === A.next) offset++;
  else if (action === A.back) offset--;

  const emoji = category.emoji ? `${category.emoji} ` : '';
  const defaultDescription = `Browse through ${category.commands.length} commands in ${emoji}${category.name}`;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji}${category.name} Commands`)
    .setDescription(category.description ?? defaultDescription)
    .setFields(fields[offset])
    .setFooter({ text: `Page ${offset + 1} / ${category.commands.length}` })
    .setColor(COLORS.embed);

  // Back button
  const backId = createId(N.action, category.name, A.back, offset);
  const backButton = new ButtonBuilder()
    .setCustomId(backId)
    .setLabel('Back')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(offset <= 0);

  // Return to root
  const rootId = createId(N.root);
  const rootButton = new ButtonBuilder()
    .setCustomId(rootId)
    .setLabel('Categories')
    .setStyle(ButtonStyle.Secondary);

  // Next button
  const nextId = createId(N.action, category.name, A.next, offset);
  const nextButton = new ButtonBuilder()
    .setCustomId(nextId)
    .setLabel('Next')
    .setStyle(ButtonStyle.Primary)
    .setDisabled(offset >= 0);

  const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
    backButton,
    rootButton,
    nextButton
  );

  return {
    embeds: [embed],
    components: [component],
  };
}
