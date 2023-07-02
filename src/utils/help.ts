import {
  ActionRowBuilder,
  ButtonBuilder,
  SelectMenuBuilder,
} from '@discordjs/builders';
import {
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import categories from '../commands';
import { chunk, createId, readId } from '.';
import { COLORS } from '../constants';
import { CommandCategoryPage } from '../types';

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

/** Select menu options for root category page */
const options = categories?.map(
  ({ name, description, emoji }) =>
    new StringSelectMenuOptionBuilder({
      label: name,
      description,
      emoji,
      value: name,
    })
);

/** Fields for each category page */
const categoryPages = new Map<string, CommandCategoryPage>();
// For some reason, the question mark is necessary for the deploy command to work, even though the type here is never undefined
categories?.forEach((category) => {
  const fields = category.commands.map((c) => ({
    name: `/${c.meta.name}`,
    value: c.meta.description,
  }));

  categoryPages.set(category.name, {
    ...category,
    length: category.commands.length,
    fields: chunk(fields, 10),
  });
});

/**
 * Generate new embed for root category page
 * @param ephemeral Whether the reply should be ephemeral
 * @returns The generated embed
 */
export function getCategoryRoot(ephemeral?: boolean): InteractionReplyOptions {
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

  const category = categoryPages.get(categoryName);
  if (!category)
    throw new Error(
      'Invalid interactionId; Failed to find corresponding category page!'
    );

  let offset = parseInt(currentOffset);
  if (isNaN(offset)) offset = 0;

  // Update offset based on action
  if (action === A.next) offset++;
  else if (action === A.back) offset--;

  const emoji = category.emoji ? `${category.emoji} ` : '';
  const defaultDescription = `Browse through ${category.length} commands in ${emoji}${category.name}`;

  const embed = new EmbedBuilder()
    .setTitle(`${emoji}${category.name} Commands`)
    .setDescription(category.description ?? defaultDescription)
    .setFields(category.fields[offset])
    .setFooter({ text: `Page ${offset + 1} / ${category.length}` })
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
