export function isoDateToFormattedUtc(isoDate: string): string {
  const date = new Date(isoDate);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // convert 0 → 12 for 12-hour clock
  const minutesStr = minutes.toString().padStart(2, '0');

  return `${month} ${day}, ${year} ${hours}:${minutesStr} ${ampm} UTC`;
}

export function formatDate(
  date: Date,
  timeZone?: string,
  locale?: string,
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    month: 'short', // “Jan”, “Feb”, etc.
    day: 'numeric', // “1”, “2”, etc.
    year: 'numeric', // “2020”
  };
  return new Intl.DateTimeFormat(locale ?? 'en-US', options).format(date);
}

/**
 * Formats a date and time to a human-readable string with time zone.
 * @param date - Date string or Date object to format.
 * @param locale - The locale to use (e.g., 'en-US', 'fr-FR') - defaults to 'en-US'
 * @returns Formatted date string (e.g., "June 14, 2023 12:00 PM MST").
 */
export function formatDateTimeReadable(
  date: string | Date,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(dateObj);
}

/**
 * Formats a date and time to a human-readable string with time zone.
 * @param date - Date string or Date object to format.
 * @param timeZone - The time zone to use (e.g., 'America/Los_Angeles') - defaults to the local time zone.
 * @param locale - The locale to use (e.g., 'en-US', 'fr-FR') - defaults to 'en-US'
 * @returns Formatted date string (e.g., "June 14, 2023 12:00 PM MST").
 */
export function formatTimeZoneDateTimeReadable(
  date: string | Date,
  timeZone?: string,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? 'en-US', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(dateObj);
}

/**
 * Formats a date to "Jun 30, 2025" style using the local time zone.
 * Accepts a Date object or a string parseable by Date.
 * @param date - Date string or Date object to format.
 * @param locale - The locale to use (e.g., 'en-US', 'fr-FR') - defaults to 'en-US'
 * @returns Formatted date string like "Jun 30, 2025".
 */
export function formatDateShort(date: string | Date, locale?: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Formats a date to "Jun 30, 2025" style using the local time zone.
 * Accepts a Date object or a string parseable by Date.
 * @param date - Date string or Date object to format.
 * @param timeZone - The time zone to use (e.g., 'America/Los_Angeles') - defaults to the local time zone.
 * @param locale - The locale to use (e.g., 'en-US', 'fr-FR') - defaults to 'en-US'
 * @returns Formatted date string like "Jun 30, 2025".
 */
export function formatTimeZoneDateShort(
  date: string | Date,
  timeZone?: string,
  locale?: string,
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale ?? 'en-US', {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Calculates the number of days between a given date and the current date.
 * @param date - The date to calculate from.
 * @returns The number of days that have passed since the given date.
 */
export function getDaysSince(date: string | Date): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
