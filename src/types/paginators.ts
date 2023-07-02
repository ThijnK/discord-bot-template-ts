import { APIEmbedField, ActionRowBuilder } from 'discord.js';

export interface Paginator {
  name: string;
  /** The title of the embed. */
  title: string;
  /** The description of the embed. */
  description: string;
  /** Whether the reply should be ephemeral. */
  ephemeral?: boolean;
  /** Optional components to include in the reply (max 4). */
  components?: ActionRowBuilder<any>[];
  /** The number of fields to display on a single page (max 25). */
  pageLength: number;
  getPage(offset: number): APIEmbedField[];
  getLength(): number;
}
