import { APIEmbedField, BaseInteraction, Client } from 'discord.js';

export type PaginationData = APIEmbedField[];

export interface PaginationProps {
  client: Client;
  interaction: BaseInteraction;
}
