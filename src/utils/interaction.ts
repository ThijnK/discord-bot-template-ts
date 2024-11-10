/**
 * The namespace of an interaction.
 */
export enum Namespace {
  Pagination = 'pagination',
  Help = 'help',
}

function toNamespace(value: string): Namespace {
  if (value in Namespace) {
    return Namespace[value as keyof typeof Namespace];
  }
  throw new Error(`Invalid Namespace: ${value}`);
}

/**
 * Creates a custom id from a namespace and list of arguments, separated by `;`.
 * @param namespace The namespace of the interaction.
 * @param args The arguments to be passed to the interaction.
 * @returns The custom id.
 * @example
 * ```ts
 * const id = createId(Namespace.Help, 'root');
 * // id = 'help;root'
 * ```
 */
export function createId(namespace: Namespace, ...args: unknown[]): string {
  return `${namespace};${args.join(';')}`;
}

/**
 * Parses a custom id into a namespace and list of arguments.
 * @param id The custom id to read.
 * @returns The namespace and list of arguments.
 * @example
 * ```ts
 * const [namespace, ...args] = readId('help;root');
 * // namespace = Namespace.Help
 * // args = ['root']
 * ```
 */
export function parseId(id: string): [namespace: Namespace, ...args: string[]] {
  const [namespace, ...args] = id.split(';');
  return [toNamespace(namespace), ...args];
}
