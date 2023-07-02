import {
  Command,
  CommandCategory,
  CommandCategoryMetadata,
  CommandExec,
  CommandMeta,
} from '../types';

export function command(meta: CommandMeta, exec: CommandExec): Command {
  return {
    meta,
    exec,
  };
}

export function category(
  metadata: CommandCategoryMetadata,
  commands: Command[]
): CommandCategory {
  return {
    ...metadata,
    commands,
  };
}
