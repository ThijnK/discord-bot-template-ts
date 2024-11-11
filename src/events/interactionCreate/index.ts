import commands from './commands.ts';
import help from './help.ts';
import pagination from './pagination.ts';
import confirmation from './confirmation.ts';

const events = [commands, help, pagination, confirmation];

export default events;
