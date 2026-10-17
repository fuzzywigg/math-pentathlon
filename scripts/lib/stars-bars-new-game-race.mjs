/**
 * Stars & Bars deep-playtest New Game race wait (q-mp-1474).
 *
 * Fixed `waitForTimeout(100)` + one-shot `.status-ai-thinking` sample is
 * racey vs a short AI-think flash. Align with par-55: poll up to ~3s for
 * thinking chrome / computer|thinking status, short-circuit on end, then
 * click New Game even if AI finished instantly (timeout).
 */

/** @type {RegExp} */
export const COMPUTER_OR_THINKING_RE = /computer|thinking/i;

/** Default poll window (par-55 sibling). */
export const AI_THINK_WAIT_MS = 3000;

/** Default poll interval (par-55 sibling). */
export const AI_THINK_POLL_MS = 40;

/**
 * @typedef {{ thinking?: boolean, status?: string | null }} AiThinkSample
 * @typedef {'thinking' | 'ended' | 'timeout'} AiThinkWaitReason
 * @typedef {{ sawThinking: boolean, reason: AiThinkWaitReason }} AiThinkWaitResult
 */

/**
 * @param {AiThinkSample | null | undefined} sample
 * @returns {boolean}
 */
export function sampleShowsAiThinking(sample) {
  if (!sample) return false;
  if (sample.thinking) return true;
  return COMPUTER_OR_THINKING_RE.test(sample.status || '');
}

/**
 * Poll until AI-thinking chrome/status, game end, or deadline.
 * Injectable `sample` / `sleep` / `now` keep the loop hermetic in unit tests.
 *
 * @param {{
 *   sample: () => Promise<AiThinkSample | null | undefined> | AiThinkSample | null | undefined,
 *   sleep?: (ms: number) => Promise<void>,
 *   isEnded?: (status: string) => boolean,
 *   now?: () => number,
 *   deadlineMs?: number,
 *   pollMs?: number,
 * }} opts
 * @returns {Promise<AiThinkWaitResult>}
 */
export async function waitForAiThinkingChrome(opts) {
  const sampleFn = opts.sample;
  const sleep =
    opts.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const isEnded = opts.isEnded ?? (() => false);
  const now = opts.now ?? Date.now;
  const deadlineMs = opts.deadlineMs ?? AI_THINK_WAIT_MS;
  const pollMs = opts.pollMs ?? AI_THINK_POLL_MS;

  const deadline = now() + deadlineMs;
  while (now() < deadline) {
    const snap = await sampleFn();
    const status = snap?.status ?? '';
    if (sampleShowsAiThinking(snap)) {
      return { sawThinking: true, reason: 'thinking' };
    }
    if (isEnded(status)) {
      return { sawThinking: false, reason: 'ended' };
    }
    await sleep(pollMs);
  }
  // AI may have finished instantly; still try the New Game race.
  return { sawThinking: false, reason: 'timeout' };
}

/**
 * Drive `waitForAiThinkingChrome` over a stubbed visibility/status sequence
 * (unit tests). Each entry is one poll sample; sleep advances a fake clock.
 *
 * @param {Iterable<AiThinkSample | null | undefined>} sequence
 * @param {{
 *   isEnded?: (status: string) => boolean,
 *   deadlineMs?: number,
 *   pollMs?: number,
 * }} [opts]
 * @returns {Promise<AiThinkWaitResult>}
 */
export async function waitForAiThinkingChromeFromSequence(sequence, opts = {}) {
  const samples = [...sequence];
  let i = 0;
  let t = 0;
  const pollMs = opts.pollMs ?? AI_THINK_POLL_MS;
  return waitForAiThinkingChrome({
    sample: () =>
      i < samples.length ? samples[i++] : { thinking: false, status: '' },
    sleep: async (ms) => {
      t += ms;
    },
    now: () => t,
    isEnded: opts.isEnded,
    deadlineMs: opts.deadlineMs ?? AI_THINK_WAIT_MS,
    pollMs,
  });
}
