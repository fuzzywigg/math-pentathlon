/**
 * Calla deep-playtest end-status matcher (q-mp-1258, q-mp-1405).
 *
 * Matches real end banners ("You Wins!", "AI Wins!", "Blue wins!",
 * "It's a Tie!") without false-ending on:
 * - substring Drawing / patience (q-mp-1258)
 * - hyphenated forms (pre-tie, pre-wins, tie-breaker)
 * - non-banner copy ("No tie yet", "Who wins the round?")
 *
 * Keep browser waitForFunction bodies in sync with CALLA_END_STATUS_RE_SOURCE
 * (page callbacks cannot import this module).
 */

/** Source body for page.waitForFunction (no flags; callers add `i`). */
export const CALLA_END_STATUS_RE_SOURCE = String.raw`(?<![A-Za-z0-9_-])(?:(?:you|ai|blue|red)\s+wins?|it'?s\s+a\s+tie)(?![A-Za-z0-9_-])`;

/** @type {RegExp} */
export const CALLA_END_STATUS_RE = new RegExp(CALLA_END_STATUS_RE_SOURCE, 'i');

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isCallaEndStatus(text) {
  return CALLA_END_STATUS_RE.test(text || '');
}
