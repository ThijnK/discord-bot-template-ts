import { APIEmbedField, BaseInteraction } from 'discord.js';
import { BaseContext } from './context';

export type PaginationData = APIEmbedField[];

export interface PaginationContext extends BaseContext {
  interaction: BaseInteraction;
}
