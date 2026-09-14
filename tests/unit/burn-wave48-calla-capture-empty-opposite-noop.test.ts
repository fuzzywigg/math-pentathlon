/**
 * Wave 48 — Calla lands empty own pit but opposite empty → no capture. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — empty opposite no capture', () => {
  it('landing on empty own pit with empty opposite does not capture', () => {
    // Keep p2 non-empty so game does not end/sweep after the sow.
    const s = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 1, 0, 0], // opposite of pit1 is index 3 (empty)
      player1Calla: 13,
      player2Calla: 15,
    };
    const next = makeMove(s, 0);
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.player1Pits[1]).toBe(1);
    expect(next.phase).not.toBe('gameOver');
  });
});
