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
import { Logger } from './logger';
import { PaginationProps, PaginationData } from '../types';

export class Paginator {
  name: string;
  /**
   * The embed data to use for the pagination embed.
   * The fields and footer are automatically set by the paginator.
   */
  embedData?:
    | Omit<APIEmbed, 'fields' | 'footer'>
    | ((props: PaginationProps) => Omit<APIEmbed, 'fields' | 'footer'>);
  /**
   * The reply to which the pagination embed and its controls are added.
   * If not specified, the reply is ephemeral by default.
   */
  replyOptions?:
    | InteractionReplyOptions
    | ((props: PaginationProps) => InteractionReplyOptions);
  /** The number of fields to display on a single page (max 25). */
  pageLength: number;
  /** Asynchronous function to fetch the data for the paginator */
  getData: (props: PaginationProps) => Promise<PaginationData>;

  // #region Cache
  /** Whether or not to cache the fetched data */
  cacheData = false;
  /** The cached data */
  protected cachedData: Map<string, PaginationData> = new Map();
  /** Function to get the cache key for the paginator */
  getCacheKey: (props: PaginationProps) => string;
  // #endregion

  private logger: Logger;

  constructor(
    /** Name of the paginator */
    name: string,
    {
      embedData,
      replyOptions,
      pageLength,
      getData,
      cacheData,
      getCacheKey,
    }: {
      /**
       * The embed data to use for the pagination embed.
       * The fields and footer are automatically set by the paginator.
       */
      embedData?: typeof Paginator.prototype.embedData;
      /**
       * The reply to which the pagination embed and its controls are added.
       * If not specified, the reply is ephemeral by default.
       */
      replyOptions?: typeof Paginator.prototype.replyOptions;
      /** The number of fields to display on a single page (max 25). */
      pageLength: typeof Paginator.prototype.pageLength;
      getData: typeof Paginator.prototype.getData;
      /** Whether or not to cache the fetched data */
      cacheData?: boolean;
      /**
       * Function to get the cache key for the paginator based on the given props.
       * This can be used to make the cache key unique to the user or guild.
       * @example
       * (props) => `${props.userId}-${props.guildId}`
       */
      getCacheKey?: typeof Paginator.prototype.getCacheKey;
    }
  ) {
    this.logger = new Logger(`paginators/${name}`);

    // Page length can be at most 25 due to limit of 25 fields per embed
    if (pageLength > 25) {
      this.logger.error(
        `Paginator "${name}" has a page length greater than 25`
      );
      process.exit(1);
    }

    // Components can have at most 3 rows, because of the 5 component limit on embeds
    // (2 are already being used for back/next buttons and page selector)
    if (
      replyOptions &&
      typeof replyOptions !== 'function' &&
      replyOptions.components &&
      replyOptions.components.length > 3
    ) {
      this.logger.error(`Paginator "${name}" has more than 3 components`);
      process.exit(1);
    }

    // The replyOptions can have at most 4 embeds, because of the 5 embed limit on replies
    // (1 is already being used for the pagination embed)
    if (
      replyOptions &&
      typeof replyOptions !== 'function' &&
      replyOptions.embeds &&
      replyOptions.embeds.length > 4
    ) {
      this.logger.error(`Paginator "${name}" has more than 4 embeds`);
      process.exit(1);
    }

    // If caching is enabled, the cache key function must be specified
    if (cacheData && !getCacheKey) {
      this.logger.error(
        `Paginator "${name}" has caching enabled but no cache key function specified`
      );
      process.exit(1);
    }

    this.name = name;
    this.embedData = embedData;
    this.replyOptions = replyOptions;
    this.pageLength = pageLength;
    this.getData = getData;
    this.cacheData = cacheData ?? false;
    this.getCacheKey = getCacheKey ?? (() => name);
  }

  /**
   * Get a page of the paginator at a given offset
   * @param offset The offset to get the page at
   * @returns The interaction reply options for the page at the given offset
   */
  public async getPage(
    offset: number,
    props: PaginationProps
  ): Promise<InteractionReplyOptions> {
    // If caching is enabled, try to get the data from the cache and fetch otherwise
    const cacheKey = this.getCacheKey(props);
    if (this.cacheData && this.cachedData.has(cacheKey)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.formatPage(offset, this.cachedData.get(cacheKey)!, props);
    }

    const data = await this.getData(props);
    if (this.cacheData) this.cachedData.set(cacheKey, data);
    return this.formatPage(offset, data, props);
  }

  /**
   * Format a page of the paginator at a given offset
   * @param offset The offset to get the page at
   * @param data The data to format
   * @returns The interaction reply options for the page at the given offset
   */
  protected formatPage(
    offset: number,
    data: PaginationData,
    props: PaginationProps
  ): InteractionReplyOptions {
    const fields = data.slice(offset, offset + this.pageLength);
    const currentPage = Math.floor(offset / this.pageLength) + 1;
    const pageCount = Math.ceil(data.length / this.pageLength);

    const embedData = this.embedData
      ? typeof this.embedData === 'function'
        ? this.embedData(props)
        : this.embedData
      : undefined;
    const embed = new EmbedBuilder(embedData)
      .setFields(fields)
      .setColor(embedData?.color ?? COLORS.embed);

    if (fields.length === 0) embed.setDescription('No results found!');
    else
      embed.setFooter({
        text: `Page ${currentPage} / ${pageCount}`,
      });

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
      .setDisabled(currentPage >= pageCount);

    const selectId = createId(NAMESPACES.pagination, this.name);
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
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        pageSelector
      );

    const replyOptions = this.replyOptions
      ? typeof this.replyOptions === 'function'
        ? this.replyOptions(props)
        : this.replyOptions
      : undefined;

    if (replyOptions?.components && replyOptions.components.length > 3)
      throw new Error(`Paginator "${this.name}" has more than 3 components`);
    if (replyOptions?.embeds && replyOptions.embeds.length > 4)
      throw new Error(`Paginator "${this.name}" has more than 4 embeds`);

    return {
      ...this.replyOptions,
      embeds: [embed, ...(replyOptions?.embeds ?? [])],
      components: [
        buttons,
        // Only show page selection menu if there are multiple pages
        ...(pageCount > 1 ? [selectMenu] : []),
        ...(replyOptions?.components ?? []),
      ],
      // Ephemeral by default
      ephemeral: replyOptions?.ephemeral ?? true,
    };
  }
}
