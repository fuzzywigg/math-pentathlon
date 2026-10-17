/**
 * Ramrod deep-playtest AI-thinking signals (q-mp-1487).
 *
 * Tip product never applies `.ramrod-computer-thinking` (CSS-only definition;
 * controller sets `className = \`ramrod-status ${state.currentPlayer}\`` and
 * text `"Computer is thinking…"`). Harness waits / metrics / capture shots
 * must use tip-real status text, `.ramrod-status` seat class, or history
 * growth — never depend on the dead thinking class. Do not implement product
 * chrome for that class here.
 */

/** Tip never emits `.ramrod-computer-thinking` (rg count 0 under ramrod `*.ts`). */
export const RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS = false;

/** Dead selector retained only so source/docs can name what tip does not emit. */
export const RAMROD_COMPUTER_THINKING_SELECTOR = '.ramrod-computer-thinking';

/** Tip-real status text for AI thinking (matches controller copy). */
export const RAMROD_AI_THINKING_STATUS_RE = /computer|thinking/i;

/**
 * @param {string | null | undefined} text
 * @returns {boolean}
 */
export function isRamrodAiThinkingStatus(text) {
  return RAMROD_AI_THINKING_STATUS_RE.test(text || '');
}

/**
 * Tip-real AI seat / thinking from status class + text (+ optional history growth).
 * Vs-AI seats AI as player2; thinking copy is "Computer is thinking…".
 *
 * @param {{
 *   className?: string,
 *   text?: string,
 *   historyGrew?: boolean,
 * }} [signals]
 * @returns {boolean}
 */
export function isRamrodAiSeatFromSignals(signals = {}) {
  const className = String(signals.className ?? '');
  const text = String(signals.text ?? '');
  if (/\bwins\b/i.test(text) || /\btie\b/i.test(text)) return false;
  if (isRamrodAiThinkingStatus(text)) return true;
  if (/\bplayer2\b/.test(className) && /\bturn\b/i.test(text)) return true;
  if (signals.historyGrew === true) return true;
  return false;
}

/**
 * Honest `thinking` metric (q-mp-1487).
 * When tip does not emit the class, derive from tip-real status text so the
 * metric is not permanently false. Dead-class presence alone must not drive
 * the metric on tip.
 *
 * @param {{
 *   statusText?: string | null,
 *   classPresent?: boolean,
 *   tipEmitsClass?: boolean,
 * }} opts
 * @returns {boolean}
 */
export function resolveRamrodThinkingMetric(opts = {}) {
  const tipEmits =
    opts.tipEmitsClass ?? RAMROD_TIP_EMITS_COMPUTER_THINKING_CLASS;
  if (tipEmits) return Boolean(opts.classPresent);
  return isRamrodAiThinkingStatus(opts.statusText);
}
