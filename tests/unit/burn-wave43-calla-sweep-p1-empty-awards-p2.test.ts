/**
 * Wave 43 — emptying P1 awards P2 remaining into calla. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 43 calla — P1 empty awards P2', () => {
  it('when P1 empties, remaining P2 pits move into P2 calla', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [2, 3, 0, 0, 0],
      player1Calla: 5,
      player2Calla: 5,
    };
    // sow pit0 with 1 cube -> lands calla free turn OR pit1 empty?
    // pit0 with 1: lands position 1 (own pit1) which was 0 -> capture check opposite 3
    // opposite of 1 is 3, P2 pit3 is 0 so no capture; side not empty.
    // Better: sow last cube into calla while emptying.
    const s2: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [2, 3, 1, 0, 0],
      player1Calla: 5,
      player2Calla: 5,
    };
    // pit4 with 1 -> position 5 = calla; P1 pits all empty after
    const next = makeMove(s2, 4);
    expect(next.phase).toBe('gameOver');
    expect(next.player2Pits.every((c) => c === 0)).toBe(true);
    expect(next.player2Calla).toBe(5 + 2 + 3 + 1);
  });
});
