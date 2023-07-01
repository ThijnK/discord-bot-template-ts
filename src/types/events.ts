import { ClientEvents, Awaitable, Client } from 'discord.js';
import { Logger } from '../utils';

export interface EventProps {
  client: Client;
  logger: Logger;
}

export type EventKeys = keyof ClientEvents;
export type EventExec<T extends EventKeys> = (
  props: EventProps,
  ...args: ClientEvents[T]
) => Awaitable<unknown>;
export interface Event<T extends EventKeys> {
  id: T;
  exec: EventExec<T>;
}
