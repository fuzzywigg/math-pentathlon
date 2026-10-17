/**
 * confusing_turn_copy gate for star-track-deep-playtest (q-mp-1475).
 * Kept free of Playwright so unit tests can import hermetically.
 */

/**
 * Live getPhaseMessage drawChains / selectChain copy (Blue or Red).
 * These are normal human-seat statuses — not confusing_turn_copy.
 */
export const STAR_TRACK_NORMAL_TURN_COPY_RE =
  /^(?:Blue|Red)'s turn - Draw chains from the bucket$|^(?:Blue|Red): Choose a chain to move$/;

/** Turn-looking status prefix (same shape the harness historically scanned). */
export const STAR_TRACK_TURN_LOOKING_RE = /Blue's turn|Red's turn|^Blue:|^Red:/;

/**
 * Gate confusing_turn_copy on real confusion only: turn-looking status that is
 * not normal drawChains/selectChain copy, outside an AI-thinking seat.
 *
 * @param {string | null | undefined} status
 * @param {boolean} thinking
 * @returns {boolean}
 */
export function isConfusingTurnCopy(status, thinking) {
  if (thinking) return false;
  const text = String(status ?? '').trim();
  if (!text) return false;
  if (!STAR_TRACK_TURN_LOOKING_RE.test(text)) return false;
  if (STAR_TRACK_NORMAL_TURN_COPY_RE.test(text)) return false;
  return true;
}

/**
 * @param {string | null | undefined} status
 * @param {boolean} thinking
 * @returns {{ type: 'confusing_turn_copy', text: string } | null}
 */
export function confusingTurnCopyFinding(status, thinking) {
  if (!isConfusingTurnCopy(status, thinking)) return null;
  return { type: 'confusing_turn_copy', text: String(status ?? '').trim() };
}
