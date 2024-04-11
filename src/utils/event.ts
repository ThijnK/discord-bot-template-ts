import { Event, EventExec, EventKeys } from '../types';
import { Client } from 'discord.js';
import { Logger } from './logger';
import { reply, instanceOfDeferableInteraction } from './replies';

export function event<T extends EventKeys>(
  id: T,
  exec: EventExec<T>
): Event<T> {
  return {
    id,
    exec,
  };
}

// Distributed event type
type DistributedEvent<T extends EventKeys> = T extends any ? Event<T> : never;

export function registerEvents<T extends EventKeys>(
  client: Client,
  events: DistributedEvent<T>[]
): void {
  for (const event of events)
    client.on(event.id, async (...args) => {
      const logger = new Logger(event.id);

      // Catch uncaught errors
      try {
        await event.exec({ client, logger }, ...args);
      } catch (error) {
        logger.error(error);
        // If the error is thrown in an interaction, reply to it
        if (
          event.id === 'interactionCreate' &&
          instanceOfDeferableInteraction(args[0])
        )
          reply.error(args[0]);
      }
    });
}
