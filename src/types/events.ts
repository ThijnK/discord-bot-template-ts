import { ClientEvents, Awaitable } from "discord.js";
import { BaseContext } from "./context.ts";

export interface EventContext extends BaseContext {}

export type EventKeys = keyof ClientEvents;
export type EventExec<T extends EventKeys> = (
  ctx: EventContext,
  ...args: ClientEvents[T]
) => Awaitable<unknown>;
export interface Event<T extends EventKeys> {
  id: T;
  exec: EventExec<T>;
}
