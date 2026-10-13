/**
 * Calla deep-playtest UX latch for blueDuringHva (q-mp-1459).
 *
 * Mid-game status like "Blue's turn - Select a shield" must set the flag.
 * End banners ("You Wins!") never match — sampling only at result assembly
 * always yields false. Latch during the play loop instead.
 */

/** @type {RegExp} */
export const BLUE_TURN_STATUS_RE = /Blue's turn/i;

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isBlueTurnStatus(text) {
  return BLUE_TURN_STATUS_RE.test(text || '');
}

/**
 * Sticky OR latch: once any Blue-turn status is seen, stay true.
 * @param {boolean} prev
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function latchBlueDuringHva(prev, text) {
  return Boolean(prev) || isBlueTurnStatus(text);
}

/**
 * Hermetic fold over a stubbed status sequence (unit tests).
 * @param {Iterable<string | null | undefined>} statuses
 * @returns {boolean}
 */
export function blueDuringHvaFromStatuses(statuses) {
  let latched = false;
  for (const st of statuses) {
    latched = latchBlueDuringHva(latched, st);
  }
  return latched;
}
