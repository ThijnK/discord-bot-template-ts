import client from 'client';
import { initPaginators, registerEvents } from 'utils';
import events from './events/index.ts';

registerEvents(client, events);
initPaginators();
