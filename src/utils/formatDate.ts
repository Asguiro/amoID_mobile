/**
 * Parses an ISO date string (YYYY-MM-DD) into a Date at local midnight.
 */
export function parseIsoDate(isoDate: string): Date | null {
  const [year, month, day] = isoDate.split('-').map(part => Number(part));

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Serializes a Date to ISO date string (YYYY-MM-DD).
 */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) for French UI display.
 */
export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) {
    return isoDate;
  }

  return `${day}/${month}/${year}`;
}

/**
 * Formats an ISO datetime string for French UI display (date only).
 */
export function formatDisplayDateTime(isoDateTime: string): string {
  const datePart = isoDateTime.split('T')[0];

  if (!datePart) {
    return isoDateTime;
  }

  return formatDisplayDate(datePart);
}

/**
 * Formats an ISO datetime string for French UI display (date + time).
 */
export function formatDisplayDateTimeFull(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) {
    return isoDateTime;
  }

  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
