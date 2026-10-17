/**
 * Console-sweep post-move settle thinking wait (q-mp-1491).
 *
 * Tip-real chrome includes shared `.status-ai-thinking` and game-specific
 * classes such as sum-dominoes `.sd-computer-thinking` / prime-gold
 * `.pg-computer-thinking`. Soft timeouts keep games without chrome moving.
 *
 * Hermetic `settleThinkingFromSequence` drives the same visible→hidden
 * phases over stubbed samples (no Playwright).
 */

/** Tip-real thinking chrome selectors used by console-sweep settle. */
export const SETTLE_THINKING_SELECTOR =
  '.status-ai-thinking, .sd-computer-thinking, .pg-computer-thinking';

/** Status text that counts as AI-thinking even without a chrome class. */
export const COMPUTER_OR_THINKING_RE = /computer|thinking/i;

/** Soft wait for thinking to appear (matches prior settleAfterMove). */
export const SETTLE_VISIBLE_MS = 500;

/** Soft wait for thinking to clear (matches prior settleAfterMove). */
export const SETTLE_HIDDEN_MS = 8_000;

/** Default poll interval for hermetic stub sequences. */
export const SETTLE_POLL_MS = 40;

/**
 * @typedef {{ thinking?: boolean, status?: string | null }} SettleThinkSample
 * @typedef {{
 *   sawThinking: boolean,
 *   cleared: boolean,
 *   visibleTimedOut: boolean,
 *   hiddenTimedOut: boolean,
 * }} SettleThinkResult
 */

/**
 * @param {SettleThinkSample | null | undefined} sample
 * @returns {boolean}
 */
export function sampleShowsSettleThinking(sample) {
  if (!sample) return false;
  if (sample.thinking) return true;
  return COMPUTER_OR_THINKING_RE.test(sample.status || '');
}

/**
 * Soft visible→hidden settle over injectable sample / sleep / now.
 *
 * @param {{
 *   sample: () => Promise<SettleThinkSample | null | undefined> | SettleThinkSample | null | undefined,
 *   sleep?: (ms: number) => Promise<void>,
 *   now?: () => number,
 *   visibleMs?: number,
 *   hiddenMs?: number,
 *   pollMs?: number,
 * }} opts
 * @returns {Promise<SettleThinkResult>}
 */
export async function settleThinkingWait(opts) {
  const sampleFn = opts.sample;
  const sleep =
    opts.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const now = opts.now ?? Date.now;
  const visibleMs = opts.visibleMs ?? SETTLE_VISIBLE_MS;
  const hiddenMs = opts.hiddenMs ?? SETTLE_HIDDEN_MS;
  const pollMs = opts.pollMs ?? SETTLE_POLL_MS;

  let sawThinking = false;
  let visibleTimedOut = false;
  const visibleDeadline = now() + visibleMs;
  while (now() < visibleDeadline) {
    const snap = await sampleFn();
    if (sampleShowsSettleThinking(snap)) {
      sawThinking = true;
      break;
    }
    await sleep(pollMs);
  }
  if (!sawThinking) visibleTimedOut = true;

  let cleared = false;
  let hiddenTimedOut = false;
  const hiddenDeadline = now() + hiddenMs;
  while (now() < hiddenDeadline) {
    const snap = await sampleFn();
    if (!sampleShowsSettleThinking(snap)) {
      cleared = true;
      break;
    }
    await sleep(pollMs);
  }
  if (!cleared) hiddenTimedOut = true;

  return { sawThinking, cleared, visibleTimedOut, hiddenTimedOut };
}

/**
 * Drive `settleThinkingWait` over a stubbed sample sequence (unit tests).
 *
 * @param {Iterable<SettleThinkSample | null | undefined>} sequence
 * @param {{
 *   visibleMs?: number,
 *   hiddenMs?: number,
 *   pollMs?: number,
 * }} [opts]
 * @returns {Promise<SettleThinkResult>}
 */
export async function settleThinkingFromSequence(sequence, opts = {}) {
  const samples = [...sequence];
  let i = 0;
  let t = 0;
  const pollMs = opts.pollMs ?? SETTLE_POLL_MS;
  return settleThinkingWait({
    sample: () =>
      i < samples.length ? samples[i++] : { thinking: false, status: '' },
    sleep: async (ms) => {
      t += ms;
    },
    now: () => t,
    visibleMs: opts.visibleMs ?? SETTLE_VISIBLE_MS,
    hiddenMs: opts.hiddenMs ?? SETTLE_HIDDEN_MS,
    pollMs,
  });
}
