/**
 * Console-sweep post-move settle thinking wait (q-mp-1491) + multi-class
 * status-node scan (q-mp-1492 / q-mp-1493).
 *
 * Tip-real chrome includes shared `.status-ai-thinking` and game-specific
 * classes such as sum-dominoes `.sd-computer-thinking` / prime-gold
 * `.pg-computer-thinking`. Soft timeouts keep games without chrome moving.
 *
 * Live product sets `` status.className = `${game}-status ${player}` ``, so
 * CSS `[class$="-status"]` misses multi-class nodes (attribute ends with the
 * player token). Class-token / `.stars-status`-style match is required.
 *
 * Hermetic `settleThinkingFromSequence` drives the same visible→hidden
 * phases over stubbed samples (no Playwright). `collectGameStatusNodes` /
 * `sampleSettleThinkingFromRoot` cover jsdom multi-class stubs.
 */

/** Tip-real thinking chrome selectors used by console-sweep settle. */
export const SETTLE_THINKING_SELECTOR =
  '.status-ai-thinking, .sd-computer-thinking, .pg-computer-thinking';

/** Status text that counts as AI-thinking even without a chrome class. */
export const COMPUTER_OR_THINKING_RE = /computer|thinking/i;

/**
 * Attribute-suffix selector that misses multi-class `*-status ${player}`.
 * Kept only so harness/unit tests can assert it stays gone.
 */
export const STATUS_ATTR_SUFFIX_SELECTOR = '[class$="-status"]';

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
 * True when a single class token is a game status class (`stars-status`, …).
 * @param {string} token
 * @returns {boolean}
 */
export function isGameStatusClassToken(token) {
  return typeof token === 'string' && token.endsWith('-status');
}

/**
 * True when `el` has a `*-status` class token (or legacy `.sd-status`).
 * @param {Element | null | undefined} el
 * @returns {boolean}
 */
export function elementHasGameStatusClass(el) {
  if (!el || !el.classList) return false;
  for (const token of el.classList) {
    if (isGameStatusClassToken(token)) return true;
  }
  return el.classList.contains('sd-status');
}

/**
 * Collect status nodes via class-token match (not attribute suffix).
 * Finds both `class="stars-status"` and `class="stars-status player2"`.
 *
 * @param {ParentNode | Document | Element} [root]
 * @returns {Element[]}
 */
export function collectGameStatusNodes(root) {
  const scope = root ?? (typeof document !== 'undefined' ? document : null);
  if (!scope || typeof scope.querySelectorAll !== 'function') return [];
  const out = [];
  for (const el of scope.querySelectorAll('[class]')) {
    if (elementHasGameStatusClass(/** @type {Element} */ (el))) {
      out.push(/** @type {Element} */ (el));
    }
  }
  return out;
}

/**
 * First non-empty trimmed status text under `root`.
 * @param {ParentNode | Document | Element} [root]
 * @returns {string}
 */
export function firstGameStatusText(root) {
  for (const el of collectGameStatusNodes(root)) {
    const t = el.textContent?.trim() ?? '';
    if (t) return t;
  }
  return '';
}

/**
 * Sample tip-real thinking chrome + status text from a DOM root (jsdom /
 * browser). Shared by console-sweep settle + nav-away mid-AI poll.
 *
 * Uses {@link collectGameStatusNodes} (Node/jsdom). For Playwright page
 * context, harnesses use {@link browserSampleSettleThinking} via `.toString()`.
 *
 * @param {ParentNode | Document | Element} root
 * @param {{ thinkingSelector?: string }} [opts]
 * @returns {SettleThinkSample}
 */
export function sampleSettleThinkingFromRoot(root, opts = {}) {
  const thinkingSelector = opts.thinkingSelector ?? SETTLE_THINKING_SELECTOR;
  const thinking =
    typeof root.querySelector === 'function'
      ? !!root.querySelector(thinkingSelector)
      : false;
  return { thinking, status: firstGameStatusText(root) };
}

/**
 * Browser-serializable status+chrome sampler (no free vars). Harnesses pass
 * `.toString()` into page.evaluate. Default thinking selector matches
 * {@link SETTLE_THINKING_SELECTOR} when `opts.thinkingSelector` is omitted.
 *
 * @param {ParentNode | Document | Element} root
 * @param {{ thinkingSelector?: string }} [opts]
 * @returns {SettleThinkSample}
 */
export function browserSampleSettleThinking(root, opts) {
  const thinkingSelector =
    (opts && opts.thinkingSelector) ||
    '.status-ai-thinking, .sd-computer-thinking, .pg-computer-thinking';
  const thinking =
    typeof root.querySelector === 'function'
      ? !!root.querySelector(thinkingSelector)
      : false;
  let status = '';
  if (typeof root.querySelectorAll === 'function') {
    for (const el of root.querySelectorAll('[class]')) {
      let statusNode = false;
      for (const token of el.classList) {
        if (typeof token === 'string' && token.endsWith('-status')) {
          statusNode = true;
          break;
        }
      }
      if (!statusNode && el.classList.contains('sd-status')) statusNode = true;
      if (!statusNode) continue;
      const t = el.textContent ? String(el.textContent).trim() : '';
      if (t) {
        status = t;
        break;
      }
    }
  }
  return { thinking, status };
}

/**
 * Browser-serializable settle signal (no free vars). Harnesses pass
 * `.toString()` into page.waitForFunction / page.evaluate.
 *
 * @param {ParentNode | Document | Element} root
 * @param {string} thinkingSel
 * @param {string} statusReSource
 * @returns {boolean}
 */
export function documentHasSettleThinkingSignal(
  root,
  thinkingSel,
  statusReSource
) {
  if (root.querySelector(thinkingSel)) return true;
  const re = new RegExp(statusReSource, 'i');
  const nodes = root.querySelectorAll('[class]');
  for (const el of nodes) {
    let statusNode = false;
    for (const token of el.classList) {
      if (typeof token === 'string' && token.endsWith('-status')) {
        statusNode = true;
        break;
      }
    }
    if (!statusNode && el.classList.contains('sd-status')) statusNode = true;
    if (!statusNode) continue;
    if (re.test(el.textContent || '')) return true;
  }
  return false;
}

/**
 * Browser-serializable soft-hidden predicate (no free vars). Inline inverse
 * of {@link documentHasSettleThinkingSignal} so page.eval needs one fnSrc.
 *
 * @param {ParentNode | Document | Element} root
 * @param {string} thinkingSel
 * @param {string} statusReSource
 * @returns {boolean}
 */
export function documentSettleThinkingCleared(
  root,
  thinkingSel,
  statusReSource
) {
  if (root.querySelector(thinkingSel)) return false;
  const re = new RegExp(statusReSource, 'i');
  const nodes = root.querySelectorAll('[class]');
  for (const el of nodes) {
    let statusNode = false;
    for (const token of el.classList) {
      if (typeof token === 'string' && token.endsWith('-status')) {
        statusNode = true;
        break;
      }
    }
    if (!statusNode && el.classList.contains('sd-status')) statusNode = true;
    if (!statusNode) continue;
    if (re.test(el.textContent || '')) return false;
  }
  return true;
}

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
