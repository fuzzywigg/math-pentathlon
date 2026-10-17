/**
 * Env parse helpers + hermetic deep-harness predicates for fab-a-diffy
 * (q-mp-1276 / 1277 / 1278 / 1484 / 1485).
 * Kept free of Playwright so unit tests can import hermetically.
 */

/** Known viewport keys for PLAYTEST_ONLY_VP. */
export const FAB_VIEWPORT_KEYS = Object.freeze(['desktop', 'tablet']);

/** Known difficulty keys for PLAYTEST_ONLY_DIFF. */
export const FAB_DIFFICULTY_KEYS = Object.freeze(['easy', 'medium', 'hard']);

/**
 * Tip product never emits `.fab-status.status-ai-thinking` (rg count 0 under
 * `src/games/fab-a-diffy/`). Product chrome lives in open draft #422 (HOLD /
 * contained) — harness must not depend on that missing class (q-mp-1484).
 */
export const FAB_TIP_EMITS_STATUS_AI_THINKING = false;

/** Dead selector retained only so source/docs can name what tip does not emit. */
export const FAB_STATUS_AI_THINKING_SELECTOR = '.fab-status.status-ai-thinking';

/**
 * PLAYTEST_SKIP_EXTRA_SHOTS enable: only clear truthy tokens (`1` / `true` / `yes`).
 * `'0'`, `'false'`, `''`, and unset do not skip (q-mp-1277; same tokens as PAR55_QUICK).
 *
 * @param {string | undefined | null} raw
 * @returns {boolean}
 */
export function isSkipExtraShotsEnabled(raw) {
  if (raw === undefined || raw === null) return false;
  const v = String(raw).trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

/**
 * Resolve PLAYTEST_ONLY_VP against known viewport keys (q-mp-1278).
 * Unset / empty → full defaults. Unknown keys → usage error shape.
 *
 * @param {string | undefined} onlyVp
 * @param {Record<string, unknown>} allViewports
 * @returns {{ ok: true, viewports: Record<string, unknown>, onlyVp: string | undefined } | { ok: false, message: string }}
 */
export function resolveFabViewports(onlyVp, allViewports) {
  if (onlyVp === undefined || onlyVp === '') {
    return { ok: true, viewports: allViewports, onlyVp: undefined };
  }
  if (!Object.prototype.hasOwnProperty.call(allViewports, onlyVp)) {
    const known = Object.keys(allViewports).join(', ');
    return {
      ok: false,
      message: `Invalid PLAYTEST_ONLY_VP=${JSON.stringify(String(onlyVp))} (expected one of: ${known}).`,
    };
  }
  return {
    ok: true,
    viewports: { [onlyVp]: allViewports[onlyVp] },
    onlyVp,
  };
}

/**
 * Resolve PLAYTEST_ONLY_DIFF against known difficulties (q-mp-1278).
 * Unset / empty → full defaults. Unknown keys → usage error shape.
 *
 * @param {string | undefined} onlyDiff
 * @param {readonly string[]} [allDiffs]
 * @returns {{ ok: true, difficulties: string[], onlyDiff: string | undefined } | { ok: false, message: string }}
 */
export function resolveFabDifficulties(
  onlyDiff,
  allDiffs = FAB_DIFFICULTY_KEYS
) {
  const diffs = [...allDiffs];
  if (onlyDiff === undefined || onlyDiff === '') {
    return { ok: true, difficulties: diffs, onlyDiff: undefined };
  }
  if (!diffs.includes(onlyDiff)) {
    return {
      ok: false,
      message: `Invalid PLAYTEST_ONLY_DIFF=${JSON.stringify(String(onlyDiff))} (expected one of: ${diffs.join(', ')}).`,
    };
  }
  return { ok: true, difficulties: [onlyDiff], onlyDiff };
}

/**
 * Tip-real AI seat from status class / text (q-mp-1484).
 * Vs-AI always seats AI as player2; tip status uses `fab-status player2` and
 * classic "Red's turn" labels (`getPlayerName` without vsAI). Also accepts
 * Computer/AI copy if seat-label chrome lands without thinking class.
 *
 * @param {{ className?: string, text?: string }} signals
 * @returns {boolean}
 */
export function isFabAiSeatFromStatus(signals = {}) {
  const className = String(signals.className ?? '');
  const text = String(signals.text ?? '');
  // No trailing \b after `!` — `!` is non-word so `\bwins!\b` never matches.
  if (/\bwins!/i.test(text)) return false;
  if (/\bplayer2\b/.test(className)) return true;
  if (/\bRed'?s turn\b/i.test(text)) return true;
  if (/\bComputer'?s turn\b/i.test(text)) return true;
  if (/\bAI'?s turn\b/i.test(text)) return true;
  return false;
}

/**
 * Tip-real human seat ready (or already ended) from status (q-mp-1484).
 * Winner status is treated as "ready to stop waiting" (not an AI seat).
 *
 * @param {{ className?: string, text?: string }} signals
 * @returns {boolean}
 */
export function isFabHumanSeatFromStatus(signals = {}) {
  const className = String(signals.className ?? '');
  const text = String(signals.text ?? '');
  if (/\bwins!/i.test(text)) return true;
  if (/\bplayer1\b/.test(className)) return true;
  if (/\bBlue'?s turn\b/i.test(text)) return true;
  if (/\bYou'?s turn\b/i.test(text)) return true;
  if (/\bYour turn\b/i.test(text)) return true;
  return false;
}

/**
 * Explicit end via tip status copy (winner line), not mid-game progress.
 *
 * @param {string | undefined | null} text
 * @returns {boolean}
 */
export function isFabExplicitEndStatus(text) {
  if (text === undefined || text === null) return false;
  return /\bwins!/i.test(String(text));
}

/**
 * Honest deep-playtest `ok` (q-mp-1485).
 * Progress alone (history / claims / passes) must not inflate pass rate.
 * Incomplete-but-clean games return `incomplete: true` with `ok: false`.
 *
 * @param {{
 *   stalls?: number,
 *   pageErrors?: unknown[],
 *   consoleErrors?: unknown[],
 *   winnerVisible?: boolean,
 *   status?: string,
 *   history?: number,
 *   claims?: number,
 *   passes?: number,
 * }} result
 * @returns {{ ok: boolean, incomplete: boolean, ended: boolean }}
 */
export function evaluateFabDeepGameOk(result = {}) {
  const stalls = result.stalls ?? 0;
  const pageErrors = result.pageErrors ?? [];
  const consoleErrors = result.consoleErrors ?? [];
  const hardErrors = consoleErrors.filter((e) =>
    /stall|lock failed|AI:/i.test(String(e))
  );
  const winnerVisible = !!result.winnerVisible;
  const ended = winnerVisible || isFabExplicitEndStatus(result.status ?? '');
  const clean =
    stalls === 0 && pageErrors.length === 0 && hardErrors.length === 0;
  return {
    ok: clean && ended,
    incomplete: clean && !ended,
    ended,
  };
}
