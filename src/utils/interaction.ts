/**
 * Creates a custom id from a namespace and list of arguments, separated by `;`.
 * @param namespace The namespace of the interaction.
 * @param args The arguments to be passed to the interaction.
 * @returns The custom id.
 * @example
 * ```ts
 * const id = createId('help', 'root');
 * // id = 'help;root'
 * ```
 */
export function createId(namespace: string, ...args: unknown[]): string {
  return `${namespace};${args.join(';')}`;
}

/**
 * Parses a custom id into a namespace and list of arguments.
 * @param id The custom id to read.
 * @returns The namespace and list of arguments.
 * @example
 * ```ts
 * const [namespace, ...args] = readId('help;root');
 * // namespace = 'help'
 * // args = ['root']
 * ```
 */
export function parseId(id: string): [namespace: string, ...args: string[]] {
  const [namespace, ...args] = id.split(';');
  return [namespace, ...args];
}
