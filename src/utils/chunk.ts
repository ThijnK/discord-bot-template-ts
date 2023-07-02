/**
 * Takes an array of items and chunks items into a matrix with a given chunk size.
 * Useful for offset based pagination.
 * @param items Array of items to chunk
 * @param chunk Chunk size
 * @returns Jagged array (matrix) of chunks
 */
export function chunk<T>(items: T[], chunk: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += chunk)
    chunks.push(items.slice(i, i + chunk));

  return chunks;
}
