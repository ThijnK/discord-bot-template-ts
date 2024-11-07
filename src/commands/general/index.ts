import { category } from 'utils';
import help from './help.ts';
import info from './info.ts';

export default category(
  {
    name: 'General',
    description: 'General bot commands.',
    emoji: '📖',
  },
  [help, info],
);
