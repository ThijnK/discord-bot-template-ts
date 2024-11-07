import { Client } from "discord.js";
import { Logger } from "utils";

export interface BaseContext {
  client: Client;
  logger: Logger;
}
