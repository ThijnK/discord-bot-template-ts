import { APIEmbedField, Client, GuildMember } from 'discord.js';

export type PaginatorData = APIEmbedField[];

export interface PaginationProps {
  client: Client;
  guildId: string;
  member: GuildMember;
}
