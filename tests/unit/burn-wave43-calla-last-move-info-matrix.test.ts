/**
 * Wave 43 — Calla getLastMoveInfo singular/plural cubes. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 43 calla — last move info matrix', () => {
  it('singular cube wording when distributing 1', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [1, 2, 2, 2, 2],
      player2Pits: [2, 2, 2, 2, 2],
    };
    const next = makeMove(state, 0);
    const info = getLastMoveInfo(next);
    expect(info).toMatch(/1 cube(?!s)/);
  });

  it('plural cubes for opening pit with 3', () => {
    const next = makeMove(createInitialState(), 0);
    expect(getLastMoveInfo(next)).toMatch(/3 cubes/);
  });
});
