/**
 * Star Track deep-playtest status-end win banners (q-mp-1483).
 *
 * Live board-ui builds `🎉 ${seatIcon} ${winnerName} Wins! 🎉` with HvA
 * winnerName = You / AI — so human wins are "You Wins!" (not "You Win!").
 * Keep browser waitForFunction bodies in sync with
 * STAR_TRACK_END_WIN_STATUS_RE_SOURCE (page callbacks cannot import this module).
 */

/** Source body for page.waitForFunction (no flags; callers add `i`). */
export const STAR_TRACK_END_WIN_STATUS_RE_SOURCE = String.raw`(You Wins!|AI Wins!|Blue Wins!|Red Wins!)`;

/** @type {RegExp} */
export const STAR_TRACK_END_WIN_STATUS_RE = new RegExp(
  STAR_TRACK_END_WIN_STATUS_RE_SOURCE,
  'i'
);

/**
 * True when status looks like a Star Track terminal win banner.
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isStarTrackEndWinStatus(text) {
  return STAR_TRACK_END_WIN_STATUS_RE.test(text || '');
}
