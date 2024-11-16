import client from 'client';
import { initPaginators, registerEvents } from 'utils';
import events from './events/index.ts';
import ENV from 'env';

client.login(ENV.BOT_TOKEN);
registerEvents(client, events);
initPaginators();
