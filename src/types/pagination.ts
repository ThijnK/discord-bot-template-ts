import { APIEmbedField, BaseInteraction, Client } from 'discord.js';

export type PaginatorData = APIEmbedField[];

export interface PaginationProps {
  client: Client;
  interaction: BaseInteraction;
}
