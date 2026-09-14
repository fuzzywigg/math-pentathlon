/**
 * Wave 56 leftover after #256 — Ramrod scores .label Blue/Red seat chrome.
 * Distinct from wave52 .value cm suffix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';
import { renderScores } from '../../src/games/ramrod/board-ui';

describe('Wave 56 ramrod — scores label seats', () => {
  it('renders .label Blue/Red seats and exact Goal cm target', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.ramrod-score.player1 .label')?.textContent).toMatch(
      /Blue/
    );
    expect(el.querySelector('.ramrod-score.player2 .label')?.textContent).toMatch(
      /Red/
    );
    expect(el.querySelector('.ramrod-target')?.textContent).toBe(
      `Goal: ${CONFIG.TARGET_SCORE}cm`
    );
    expect(el.querySelector('.ramrod-score.player1 .value')?.textContent).toBe('0cm');
    expect(el.querySelector('.ramrod-score.player2 .value')?.textContent).toBe('0cm');
  });
});
