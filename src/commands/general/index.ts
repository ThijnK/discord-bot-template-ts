import { category } from '../../utils';
import help from './help';
import info from './info';

export default category(
  {
    name: 'General',
    description: 'General commands',
    emoji: '📖',
  },
  [help, info]
);
