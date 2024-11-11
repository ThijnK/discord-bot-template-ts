import { category } from 'utils';
import ping from './ping.ts';
import confirm from './confirm.ts';

export default category(
  { name: 'Debug', description: 'Commands used for debugging.', emoji: '🐛' },
  [ping, confirm],
);
