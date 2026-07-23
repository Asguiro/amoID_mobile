/**
 * Fire-and-forget async work without the `void` operator (eslint no-void).
 * Errors are expected to be handled inside `fn` (UI state / userFacingError).
 */
export function runAsync(fn: () => Promise<unknown>): undefined {
  fn().catch(() => undefined);
  return undefined;
}
