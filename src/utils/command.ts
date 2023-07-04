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
