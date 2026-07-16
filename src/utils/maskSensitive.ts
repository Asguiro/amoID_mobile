/**
 * Masks a NINA for display — keeps prefix and last digits only.
 */
export function maskNina(nina: string): string {
  const trimmed = nina.trim();

  if (!trimmed) {
    return '—';
  }

  if (trimmed.length <= 6) {
    return `${trimmed.slice(0, 2)}****`;
  }

  const visibleStart = trimmed.slice(0, 4);
  const visibleEnd = trimmed.slice(-3);
  const maskedLength = Math.max(trimmed.length - visibleStart.length - visibleEnd.length, 3);

  return `${visibleStart}${'*'.repeat(maskedLength)}${visibleEnd}`;
}
