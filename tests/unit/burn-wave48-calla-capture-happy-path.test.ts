/**
 * Wave 48 — Calla capture when opposite has cubes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — capture happy path', () => {
  it('captures opposite cubes into calla', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 4, 0], // opposite of pit1 is index 3
      player1Calla: 10,
      player2Calla: 15,
    };
    const next = makeMove(s, 0);
    expect(next.moveHistory[0].captured).toBe(5); // 4 + capturing cube
    expect(next.player2Pits[3]).toBe(0);
    expect(next.player1Pits[1]).toBe(0);
    expect(next.player1Calla).toBe(15);
  });
});
