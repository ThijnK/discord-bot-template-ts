import {
  APIEmbed,
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
import { PaginatorData } from '../types';

export class Paginator {
  name: string;
  /**
   * The embed data to use for the pagination embed.
   * The fields and footer are automatically set by the paginator.
   */
  embedData: Omit<APIEmbed, 'fields' | 'footer'>;
  /**
   * The reply to which the pagination embed and its controls are added.
   * If not specified, the reply is ephemeral by default.
   */
  replyOptions: InteractionReplyOptions;
  /** The number of fields to display on a single page (max 25). */
  pageLength: number;

  data: PaginatorData;
  pageCount: number;

  constructor(
    /** Name of the paginator */
    name: string,
    {
      embedData,
      replyOptions,
      pageLength,
      data,
    }: {
      /**
       * The embed data to use for the pagination embed.
       * The fields and footer are automatically set by the paginator.
       */
      embedData: typeof Paginator.prototype.embedData;
      /**
       * The reply to which the pagination embed and its controls are added.
       * If not specified, the reply is ephemeral by default.
       */
      replyOptions: typeof Paginator.prototype.replyOptions;
      /** The number of fields to display on a single page (max 25). */
      pageLength: typeof Paginator.prototype.pageLength;
      data: typeof Paginator.prototype.data;
    }
  ) {
    // Page length can be at most 25 due to limit of 25 fields per embed
    if (pageLength > 25) {
      log.error(
        'paginators',
        `Paginator "${name}" has a page length greater than 25`
      );
      process.exit(1);
    }

    // Components can have at most 3 rows, because of the 5 component limit on embeds
    // (2 are already being used for back/next buttons and page selector)
    if (replyOptions.components && replyOptions.components.length > 3) {
      log.error('paginators', `Paginator "${name}" has more than 3 components`);
      process.exit(1);
    }

    // The replyOptions can have at most 4 embeds, because of the 5 embed limit on replies
    // (1 is already being used for the pagination embed)
    if (replyOptions.embeds && replyOptions.embeds.length > 4) {
      log.error('paginators', `Paginator "${name}" has more than 4 embeds`);
      process.exit(1);
    }

    this.name = name;
    this.embedData = embedData;
    this.replyOptions = replyOptions;
    this.pageLength = pageLength;
    this.data = data;
    this.pageCount = Math.ceil(data.length / pageLength);
  }

  /**
   * Get a page of the paginator at a given offset
   * @param offset The offset to get the page at
   * @returns The interaction reply options for the page at the given offset
   */
  getPage(offset: number): InteractionReplyOptions {
    return this.formatPage(offset, this.data);
  }

  /**
   * Format a page of the paginator at a given offset
   * @param offset The offset to get the page at
   * @param data The data to format
   * @returns The interaction reply options for the page at the given offset
   */
  protected formatPage(
    offset: number,
    data: PaginatorData
  ): InteractionReplyOptions {
    const fields = data.slice(offset, offset + this.pageLength);
    const currentPage = Math.floor(offset / this.pageLength) + 1;

    const embed = new EmbedBuilder(this.embedData)
      .setFields(fields)
      .setFooter({
        text: `Page ${currentPage} / ${this.pageCount}`,
      })
      .setColor(this.embedData.color ?? COLORS.embed);

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
      ...this.replyOptions,
      embeds: [embed, ...(this.replyOptions.embeds ?? [])],
      components: [
        buttons,
        // Only show page selection menu if there are multiple pages
        ...(this.pageCount > 1 ? [selectMenu] : []),
        ...(this.replyOptions.components ?? []),
      ],
      // Ephemeral by default
      ephemeral: this.replyOptions.ephemeral ?? true,
    };
  }
}
