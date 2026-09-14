/**
 * Wave 43 — Calla free-turn keeps seat; getValidPits updates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getValidPits } from '../../src/games/calla/rules';

describe('Wave 43 calla — free turn valid pits', () => {
  it('landing in calla keeps player1 and still has valids', () => {
    // pit2 with 3 cubes: lands calla → free turn
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
    expect(getValidPits(next).length).toBeGreaterThan(0);
    expect(getValidPits(next).every((i) => next.player1Pits[i] > 0)).toBe(true);
  });
});
