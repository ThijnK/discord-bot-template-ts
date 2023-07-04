import { category } from '../../utils';
import info from './info';
import ping from './ping';

export default category(
  { name: 'Debug', description: 'Commands used for debugging', emoji: '🐛' },
  [ping, info]
);
