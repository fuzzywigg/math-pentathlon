/**
 * Wave 43 — isGameOver true when winner set even if phase selectPit. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { isGameOver, getValidPits } from '../../src/games/calla/rules';

describe('Wave 43 calla — isGameOver winner-only', () => {
  it('winner set with selectPit phase is game over; valids still computed from pits', () => {
    const state = {
      ...createInitialState(),
      winner: 'player1' as const,
      phase: 'selectPit' as const,
    };
    expect(isGameOver(state)).toBe(true);
    // getValidPits does not check winner — only phase
    expect(getValidPits(state).length).toBeGreaterThan(0);
  });
});
