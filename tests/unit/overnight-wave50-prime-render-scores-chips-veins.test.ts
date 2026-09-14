/**
 * Overnight HEAVY leftover after #229 — Prime Gold scores chips/veins chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderScores } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — scores', () => {
  it('renders Blue/Red chip and vein counts', () => {
    const state = {
      ...createInitialState(),
      playerChips: { player1: 17, player2: 19 },
      primeVeins: { player1: 2, player2: 1 },
    };
    const el = renderScores(state);
    expect(el.classList.contains('pg-scores')).toBe(true);
    expect(el.querySelector('.pg-score.player1')?.textContent).toMatch(/Blue: 17 chips/);
    expect(el.querySelector('.pg-score.player1')?.textContent).toMatch(/2 veins/);
    expect(el.querySelector('.pg-score.player2')?.textContent).toMatch(/Red: 19 chips/);
    expect(el.querySelector('.pg-score.player2')?.textContent).toMatch(/1 veins/);
  });
});
