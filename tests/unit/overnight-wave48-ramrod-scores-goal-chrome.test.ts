/**
 * Wave 48 overnight — Ramrod scores Goal chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderScores } from '../../src/games/ramrod/board-ui';
import { CONFIG } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod overnight — scores goal', () => {
  it('renders Goal TARGET_SCORE and seat cm values', () => {
    const s = { ...createInitialState(), scores: { player1: 11, player2: 5 } };
    const el = renderScores(s);
    expect(el.querySelector('.ramrod-target')!.textContent).toBe(`Goal: ${CONFIG.TARGET_SCORE}cm`);
    expect(el.querySelector('.ramrod-score.player1 .value')!.textContent).toBe('11cm');
    expect(el.querySelector('.ramrod-score.player2 .value')!.textContent).toBe('5cm');
  });
});
