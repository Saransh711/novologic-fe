/**
 * Formats an ISO-8601 timestamp (the API's `DateTime` scalar) into a readable
 * medium date using the visitor's locale. Returns an empty string for invalid
 * input so callers never render `Invalid Date`.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

/**
 * Formats an ISO-8601 timestamp into a readable date *and* time, used where the
 * exact moment matters (e.g. version-history snapshots taken minutes apart).
 * Returns an empty string for invalid input.
 */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}
