import client from "client";
import { registerEvents } from "utils";
import events from "./events/index.ts";

registerEvents(client, events);
