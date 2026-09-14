/**
 * Wave 48 overnight — Calla analyze empty-opposite no-capture reason. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { analyzeMoves } from '../../src/games/calla/ai';

describe('Wave 48 calla overnight — empty opposite reason', () => {
  it('mentions opposite pit empty when landing own empty with empty opp', () => {
    // pit0 has 1 → lands pit1; make pit1 empty and opposite of pit1 (index 3) empty
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 0],
      player1Calla: 10,
      player2Calla: 10,
    };
    const analyses = analyzeMoves(state, 'player1');
    expect(analyses[0].outcome.landsSide).toBe('own');
    expect(analyses[0].outcome.captureAmount).toBe(0);
    expect(analyses[0].reasoning).toMatch(/opposite pit is empty/i);
  });
});
