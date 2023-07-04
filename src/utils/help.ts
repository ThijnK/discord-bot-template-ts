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
      options: categories?.map(({ name, description, emoji }) => ({
        label: name,
        description,
        emoji,
        value: name,
      })),
    })
  );
