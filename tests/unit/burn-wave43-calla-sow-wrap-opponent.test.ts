/**
 * Wave 43 — Calla sow wraps into opponent pits order. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — sow wrap opponent', () => {
  it('large sow from pit4 distributes into opponent side', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 8],
      player2Pits: [1, 1, 1, 1, 1],
      player1Calla: 0,
      player2Calla: 0,
    };
    const next = makeMove(state, 4);
    expect(next.player1Pits[4]).toBe(0);
    expect(next.moveHistory[0].cubesDistributed).toBe(8);
    // should have touched opponent pits
    const p2Sum = next.player2Pits.reduce((a, b) => a + b, 0);
    expect(p2Sum).toBeGreaterThan(5);
  });
});
