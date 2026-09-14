/**
 * Wave 43 — Calla capture via empty own pit + opposite. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

function base(overrides: Partial<CallaGameState> = {}): CallaGameState {
  return { ...createInitialState(), ...overrides };
}

describe('Wave 43 calla — capture opposite', () => {
  it('landing in empty own pit captures opposite cubes into calla', () => {
    // pit0 has 1 cube → lands in pit1 which we make empty; opposite of 1 is 3
    const state = base({
      player1Pits: [1, 0, 2, 0, 2],
      player2Pits: [0, 0, 0, 4, 0],
      player1Calla: 0,
      player2Calla: 0,
    });
    const next = makeMove(state, 0);
    expect(next.moveHistory[0].captured).toBeGreaterThan(0);
    expect(next.player1Calla).toBeGreaterThan(0);
    expect(next.player1Pits[1]).toBe(0); // capturing cube also taken
    expect(next.player2Pits[3]).toBe(0);
  });

  it('getLastMoveInfo narrates capture and free turn', () => {
    expect(getLastMoveInfo(createInitialState())).toBeNull();
    const free = makeMove(createInitialState(), 2);
    const info = getLastMoveInfo(free);
    expect(info).toMatch(/distributed/);
    if (free.moveHistory[0].gotFreeTurn) {
      expect(info).toMatch(/Free turn/);
    }
  });

  it('no capture when opposite is empty', () => {
    const state = base({
      player1Pits: [1, 0, 2, 2, 2],
      player2Pits: [0, 0, 0, 0, 1],
    });
    const next = makeMove(state, 0);
    // lands in pit1 empty but opposite (3) empty → no capture
    expect(next.moveHistory[0].captured).toBe(0);
    expect(next.player1Pits[1]).toBe(1);
  });
});
