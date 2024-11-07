import {
  Command,
  CommandAutocomplete,
  CommandCategory,
  CommandCategoryCommands,
  CommandCategoryMetadata,
  CommandExec,
  CommandMeta,
  CommandOptions,
} from 'types';

export function command({
  meta,
  exec,
  autocomplete,
  ...options
}: {
  meta: CommandMeta;
  exec: CommandExec;
  autocomplete?: CommandAutocomplete;
} & CommandOptions): Command {
  return {
    meta,
    exec,
    autocomplete,
    options,
  };
}

export function category(
  metadata: CommandCategoryMetadata,
  commands: Command[],
): CommandCategory {
  return {
    ...metadata,
    commands: {
      public: commands.filter((c) => !c.options.private),
      private: commands.filter((c) => c.options.private),
      all: commands,
    },
  };
}

/**
 * Extracts the metadata from a list of categories.
 * @param categories The categories to extract metadata from.
 * @param type The type of commands to extract metadata from (public, private, or all).
 * @returns The extracted list of metadata.
 */
export function extractMeta(
  categories: CommandCategory[],
  type: keyof CommandCategoryCommands,
) {
  return categories.flatMap(({ commands }) =>
    commands[type].map(({ meta }) => meta)
  );
}
