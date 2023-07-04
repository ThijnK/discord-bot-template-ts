import {
  Command,
  CommandCategory,
  CommandCategoryMetadata,
  CommandExec,
  CommandMeta,
  CommandOptions,
} from '../types';

export function command(
  meta: CommandMeta,
  exec: CommandExec,
  opts: CommandOptions | undefined = undefined
): Command {
  return {
    meta,
    exec,
    options: opts,
  };
}

export function category(
  metadata: CommandCategoryMetadata,
  commands: Command[]
): CommandCategory {
  return {
    ...metadata,
    commands: {
      public: commands.filter((c) => !c.options?.private),
      private: commands.filter((c) => c.options?.private),
      all: commands,
    },
  };
}
