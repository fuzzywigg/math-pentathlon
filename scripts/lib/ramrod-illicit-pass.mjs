/**
 * Ramrod deep-playtest illicit-pass sampling helpers (q-mp-1468).
 *
 * Blue select affordance must be sampled *after* waitForHumanOrEnd (or
 * latched during/after that wait). Pre-wait samples are stale while AI is
 * still thinking — illicitPassSkip undercounts.
 */

/** @type {RegExp} */
export const BLUE_SELECT_STATUS_RE = /Blue's turn - Select a rod/;

/** @type {RegExp} */
export const COMPUTER_OR_THINKING_RE = /computer|thinking/i;

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isBlueSelectStatus(text) {
  return BLUE_SELECT_STATUS_RE.test(text || '');
}

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isComputerOrThinkingStatus(text) {
  return COMPUTER_OR_THINKING_RE.test(text || '');
}

/**
 * Illicit pass skip: after the human-seat wait Blue had select, then status
 * flipped to computer/thinking with no selectable rods (no successful place).
 *
 * @param {{
 *   blueSelectAfterWait: boolean,
 *   afterStatus: string | null | undefined,
 *   afterSelectable: number,
 * }} sample
 * @returns {boolean}
 */
export function isIllicitPassSkip(sample) {
  return (
    Boolean(sample.blueSelectAfterWait) &&
    isComputerOrThinkingStatus(sample.afterStatus) &&
    sample.afterSelectable === 0
  );
}
