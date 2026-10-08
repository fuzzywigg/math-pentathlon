/**
 * Shared AI search helpers for unit tests.
 *
 * Production play paths always pass a soft deadline; many TOKENMAXX leftovers
 * call getAIMove/searchAIMove with no options and therefore run unlimited
 * enumeration. For assertions that only require a legal move (or worker/direct
 * parity under identical options), use a deterministic fake clock so wall time
 * stays near-zero without dropping expects.
 */

/** Clock that reads 0 once (search start), then jumps past the deadline. */
export function expireAfterStart(deadlineMs: number): () => number {
  let ticks = 0;
  return () => (ticks++ === 0 ? 0 : deadlineMs + 1);
}

/** Soft-deadline options that truncate immediately after search start. */
export function fastDeadlineOpts(
  seed?: number,
  deadlineMs = 0
): {
  seed?: number;
  deadlineMs: number;
  now: () => number;
} {
  return {
    ...(seed === undefined ? {} : { seed }),
    deadlineMs,
    now: expireAfterStart(deadlineMs),
  };
}
