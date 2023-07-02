import categories from '../../commands';
import { Paginator } from '../../types/paginators';
import { helpSelectComponent } from '../help';

const paginators: Paginator[] = categories.map((category) => {
  const items = category.commands.map((c) => ({
    name: `/${c.meta.name}`,
    value: c.meta.description,
  }));

  const emoji = category.emoji ? `${category.emoji} ` : '';

  const pageLength = 2;
  return {
    name: category.name,
    title: `${emoji}${category.name} Commands`,
    description:
      category.description ??
      `Browse through ${category.commands.length} commands in ${emoji}${category.name}`,
    pageLength,
    getPage: (offset) => items.slice(offset, offset + pageLength),
    getLength: () => items.length,
    components: [helpSelectComponent],
  };
});

export default paginators;
