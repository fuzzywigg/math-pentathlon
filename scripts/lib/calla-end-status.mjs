/**
 * Calla deep-playtest end-status matcher (q-mp-1258).
 *
 * Word-boundary match so mid-hand copy like "Drawing…" / "patience" does not
 * false-end a run (substring /win|tie/i matched both).
 *
 * Real banners still match: "You Wins!", "AI Wins!", "It's a Tie!", "… wins!".
 */

/** @type {RegExp} */
export const CALLA_END_STATUS_RE = /\b(?:wins?|tie)\b/i;

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isCallaEndStatus(text) {
  return CALLA_END_STATUS_RE.test(text || '');
}
