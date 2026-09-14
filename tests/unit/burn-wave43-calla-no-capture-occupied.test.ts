/**
 * Wave 43 — Calla no capture when landing pit already occupied. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — no capture on occupied land', () => {
  it('landing on own pit that ends at count>1 does not capture', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [2, 1, 0, 0, 0],
      player2Pits: [3, 3, 3, 3, 3],
      player1Calla: 0,
      player2Calla: 0,
    };
    // sow pit0 (2 cubes): lands at pit1 then pit2. pit2 was 0 → ends with 1 → WOULD capture
    // Instead sow pit1 (1 cube): lands at pit2 which was 0 → capture path
    // For no-capture: sow so last land on pit that already had cubes.
    // player1Pits [0,0,3,0,0]: sow pit2 (3) → positions 3,4,calla. free turn into calla — no capture.
    const free = {
      ...createInitialState(),
      player1Pits: [0, 0, 3, 0, 0],
      player2Pits: [5, 5, 5, 5, 5],
    };
    const next = makeMove(free, 2);
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.moveHistory[0].gotFreeTurn).toBe(true);
    expect(next.currentPlayer).toBe('player1');
  });
});
