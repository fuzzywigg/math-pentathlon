/**
 * Par 55 deep-playtest UX metric: illicit AI pass of Blue (q-mp-1466).
 *
 * Harness comment intent: history jumped with a Blue history entry while the
 * human harness acted (without the human having placed), or Blue's seat was
 * stolen via passTurn (flat history + computer status after a non-pass action).
 */

/** @type {RegExp} */
export const COMPUTER_STATUS_RE = /computer|thinking/i;

/**
 * @param {string | null | undefined} humanAction
 * @returns {boolean}
 */
export function humanPlacedAction(humanAction) {
  return humanAction === 'place' || humanAction === 'place-only';
}

/**
 * @param {string | null | undefined} humanAction
 * @returns {boolean}
 */
export function humanPassedAction(humanAction) {
  return humanAction === 'pass';
}

/**
 * @param {{
 *   histBefore: number,
 *   histAfter: number,
 *   blueCountBefore: number,
 *   blueCountAfter: number,
 *   humanAction: string | null | undefined,
 *   statusAfter: string | null | undefined,
 * }} sample
 * @returns {boolean}
 */
export function isIllicitBluePassSample(sample) {
  const histBefore = Number(sample?.histBefore) || 0;
  const histAfter = Number(sample?.histAfter) || 0;
  const blueBefore = Number(sample?.blueCountBefore) || 0;
  const blueAfter = Number(sample?.blueCountAfter) || 0;
  const humanAction = sample?.humanAction;
  const statusAfter = sample?.statusAfter || '';

  const historyJumped = histAfter > histBefore;
  const blueJumped = blueAfter > blueBefore;

  // History jumped with Blue while we did not place → illicit Blue attribution.
  if (historyJumped && blueJumped && !humanPlacedAction(humanAction)) {
    return true;
  }

  // Seat stolen via passTurn: we did not pass, history flat, computer owns seat.
  if (
    !humanPassedAction(humanAction) &&
    histAfter === histBefore &&
    COMPUTER_STATUS_RE.test(statusAfter)
  ) {
    return true;
  }

  return false;
}

/**
 * Hermetic fold over a stubbed history/status sequence (unit tests).
 * @param {Iterable<{
 *   histBefore: number,
 *   histAfter: number,
 *   blueCountBefore: number,
 *   blueCountAfter: number,
 *   humanAction: string | null | undefined,
 *   statusAfter: string | null | undefined,
 * }>} samples
 * @returns {number}
 */
export function countIllicitBluePasses(samples) {
  let n = 0;
  for (const sample of samples) {
    if (isIllicitBluePassSample(sample)) n++;
  }
  return n;
}
