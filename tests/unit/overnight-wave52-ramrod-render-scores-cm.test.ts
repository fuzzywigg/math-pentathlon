/**
 * Overnight HEAVY leftover after #234 — Ramrod scores cm suffix chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderScores } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — scores cm', () => {
  it('shows nonzero scores with cm suffix and Goal label', () => {
    const s = {
      ...createInitialState(),
      scores: { player1: 5, player2: 8 },
    };
    const el = renderScores(s);
    expect(el.querySelector('.ramrod-score.player1 .value')?.textContent).toBe('5cm');
    expect(el.querySelector('.ramrod-score.player2 .value')?.textContent).toBe('8cm');
    expect(el.querySelector('.ramrod-target')?.textContent).toMatch(/Goal:/);
  });
});
