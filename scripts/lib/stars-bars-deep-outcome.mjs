/**
 * Stars & Bars deep-playtest outcome + thinking metrics (q-mp-1486 / q-mp-1490).
 *
 * Product HvA banners use Blue/Red seat names (`getPlayerName`), never
 * "Computer wins". Par-55 / sum-dominoes siblings classify Red → `ai-win`.
 * Tip product never emits `.status-ai-thinking`; thinking chrome is status
 * text `"Computer is thinking…"`.
 */

import { isDeepPlaytestDrawStatus } from './deep-playtest-end.mjs';

/** Tip-real AI-thinking status (ellipsis may be `…` or `...`). */
export const AI_THINKING_STATUS_RE = /computer is thinking/i;

/** Red seat win → AI win (par-55 / sum-dominoes sibling shape). */
export const AI_WIN_STATUS_RE = /red/i;

/**
 * @param {string | null | undefined} statusText
 * @returns {boolean}
 */
export function statusShowsAiThinking(statusText) {
  return AI_THINKING_STATUS_RE.test(statusText || '');
}

/**
 * Classify a terminal HvA status banner after `isDeepPlaytestEndStatus`.
 * Draw/tie first; Red → `ai-win`; otherwise `human-win` (Blue).
 *
 * @param {string | null | undefined} statusText
 * @returns {'draw' | 'ai-win' | 'human-win'}
 */
export function classifyStarsBarsHvAOutcome(statusText) {
  if (isDeepPlaytestDrawStatus(statusText)) return 'draw';
  if (AI_WIN_STATUS_RE.test(statusText || '')) return 'ai-win';
  return 'human-win';
}
