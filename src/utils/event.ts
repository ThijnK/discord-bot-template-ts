import { Event, EventExec, EventKeys } from '../types';
import { Client } from 'discord.js';
import { Logger } from './logger';

export function event<T extends EventKeys>(
  id: T,
  exec: EventExec<T>
): Event<T> {
  return {
    id,
    exec,
  };
}

export function registerEvents(client: Client, events: Event<never>[]): void {
  for (const event of events)
    client.on(event.id, async (...args) => {
      const logger = new Logger(event.id);

      // Catch uncaught errors
      try {
        await event.exec({ client, logger }, ...args);
      } catch (error) {
        logger.error(error);
      }
    });
}
