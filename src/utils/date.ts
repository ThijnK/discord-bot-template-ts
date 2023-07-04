/**
 * Format a date to a string
 * @param date The date to format
 * @returns The formatted date string
 * @note This is very basic and only supports the format `dd/mm/yyyy`, for more in-depth formatting, it is recommneded to use a library such as [date-fns](https://date-fns.org/)
 */
export const formatDate = (date: Date) =>
  `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
