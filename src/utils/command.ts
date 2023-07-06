import {
  Command,
  CommandCategory,
  CommandCategoryMetadata,
  CommandExec,
  CommandMeta,
  CommandOptions,
} from '../types';

export function command(
  { meta, ...options }: { meta: CommandMeta } & CommandOptions,
  exec: CommandExec
): Command {
  return {
    meta,
    exec,
    options,
  };
}

export function category(
  metadata: CommandCategoryMetadata,
  commands: Command[]
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
  type: keyof CommandCategory['commands']
) {
  return categories.flatMap(({ commands }) =>
    commands[type].map(({ meta }) => meta)
  );
}
