import 'dotenv/config';
import client from './client';
import { registerEvents } from './utils';
import events from './events';

registerEvents(client, events);
