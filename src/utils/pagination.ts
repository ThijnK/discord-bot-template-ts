import {
  APIEmbedField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  InteractionReplyOptions,
  StringSelectMenuBuilder,
} from 'discord.js';
import { createId } from './interaction';
import { COLORS, NAMESPACES } from '../constants';
import { log } from './logger';

export class Paginator {
  name: string;
  /** The title of the embed. */
  title: string;
  /** The description of the embed. */
  description: string;
  /** Whether the reply should be ephemeral. */
  ephemeral?: boolean;
  /** Optional components to include in the reply (max 3). */
  components?: ActionRowBuilder<any>[];
  /** The number of fields to display on a single page (max 25). */
  pageLength: number;

  data: APIEmbedField[];
  pageCount: number;

  constructor(
    /** Name of the paginator */
    name: string,
    {
      title,
      description,
      pageLength,
      ephemeral,
      components,
      data,
    }: {
      /** The title of the embed. */
      title: string;
      /** The description of the embed. */
      description: string;
      /** Whether the reply should be ephemeral. */
      ephemeral?: boolean;
      /** Optional components to include in the reply (max 3). */
      components?: ActionRowBuilder<any>[];
      /** The number of fields to display on a single page (max 25). */
      pageLength: number;
      data: APIEmbedField[];
    }
  ) {
    // Check for invalid values
    if (pageLength > 25) {
      log.error(
        'paginators',
        `Paginator "${name}" has a page length greater than 25`
      );
      process.exit(1);
    }

    if (components && components.length > 3) {
      log.error('paginators', `Paginator "${name}" has more than 3 components`);
      process.exit(1);
    }

    this.name = name;
    this.title = title;
    this.description = description;
    this.pageLength = pageLength;
    this.ephemeral = ephemeral;
    this.components = components;
    this.data = data;
    this.pageCount = data.length / pageLength;
  }

  /**
   * Get a page of the paginator at a given offset
   * @param offset The offset to get the page at
   * @returns The interaction repy options for the page at the given offset
   */
  getPage(offset: number): InteractionReplyOptions {
    const fields = this.data.slice(offset, offset + this.pageLength);
    const currentPage = Math.floor(offset / this.pageLength) + 1;

    const embed = new EmbedBuilder()
      .setTitle(this.title)
      .setDescription(this.description)
      .setFields(fields)
      .setFooter({
        text: `Page ${currentPage} / ${this.pageCount}`,
      })
      .setColor(COLORS.embed);

    // Back button
    const backId = createId(
      NAMESPACES.pagination,
      this.name,
      offset - this.pageLength
    );
    const backButton = new ButtonBuilder()
      .setCustomId(backId)
      .setLabel('Back')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(offset <= 0);

    // Next button
    const nextId = createId(
      NAMESPACES.pagination,
      this.name,
      offset + this.pageLength
    );
    const nextButton = new ButtonBuilder()
      .setCustomId(nextId)
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(currentPage >= this.pageCount);

    const selectId = createId(NAMESPACES.pagination, this.name);
    const pageSelector = new StringSelectMenuBuilder()
      .setCustomId(selectId)
      .setPlaceholder('Select a page...')
      .setMaxValues(1)
      .setOptions(
        Array.from(Array(this.pageCount).keys()).map((i) => ({
          label: `Page ${i + 1}`,
          value: i.toString(),
        }))
      );

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      backButton,
      nextButton
    );
    const selectMenu =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        pageSelector
      );

    return {
      embeds: [embed],
      components: [buttons, selectMenu, ...(this.components ?? [])],
      // Ephemeral by default
      ephemeral: this.ephemeral ?? true,
    };
  }
}
