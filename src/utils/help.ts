import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { NAMESPACES } from '../constants';
import { createId } from './interaction';
import categories from '../commands';

/** Select menu for the help embed */
export const helpSelectComponent =
  new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder({
      custom_id: createId(NAMESPACES.help),
      placeholder: 'Select a category...',
      max_values: 1,
      // Filter out categories with no public commands
      options: categories
        ?.filter((c) => c.commands.public.length > 0)
        .map(({ name, description, emoji }) => ({
          label: name,
          description,
          emoji,
          value: name,
        })),
    })
  );
