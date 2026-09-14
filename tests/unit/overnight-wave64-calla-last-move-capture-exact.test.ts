/**
 * Wave 64 leftover after tip/#303 — Calla getLastMoveInfo capture exact.
 * Soft /captured/ elsewhere; lock full Blue distributed…, captured N! string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 64 calla — last-move capture exact', () => {
  it('P1 capture is exact Blue distributed 1 cube, captured 5!', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 4, 0],
      player1Calla: 10,
      player2Calla: 15,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory.at(-1)?.captured).toBe(5);
    expect(getLastMoveInfo(next)).toBe(
      'Blue distributed 1 cube, captured 5!'
    );
  });
});
