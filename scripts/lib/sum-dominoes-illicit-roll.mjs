/**
 * Sum Dominoes deep-playtest illicit human-roll skip gate (q-mp-1467).
 *
 * Pre-wait `before.roll` is typically false during AI think, so the illicit
 * metric undercounts once waitForHumanOrEnd establishes the Roll affordance.
 * Latch roll AFTER the human-seat wait (or use the wait's canRoll), then
 * compare to the post-failed-play snapshot.
 */

/**
 * @param {{ roll?: boolean } | null | undefined} seat
 *   Post-wait human-seat snapshot; `roll` = enabled Roll button.
 * @param {{ dice?: boolean, roll?: boolean } | null | undefined} after
 *   Snapshot after failed human play attempt.
 * @returns {boolean}
 */
export function isIllicitHumanRollSkip(seat, after) {
  return Boolean(seat?.roll && after?.dice && !after?.roll);
}

/**
 * Hermetic fold: count illicit skips over stubbed seat/after pairs.
 * @param {Iterable<{ seat: { roll?: boolean }, after: { dice?: boolean, roll?: boolean } }>} pairs
 * @returns {number}
 */
export function countIllicitHumanRollSkips(pairs) {
  let n = 0;
  for (const { seat, after } of pairs) {
    if (isIllicitHumanRollSkip(seat, after)) n++;
  }
  return n;
}
