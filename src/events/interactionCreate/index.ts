import { Event } from '../../types';
import commands from './commands';
import help from './help';
import pagination from './pagination';

const events: Event<any>[] = [commands, help, pagination];

export default events;
