/**
 * Wave 65 leftover after tip/#315 — Calla getLastMoveInfo capture-6 exact.
 * Wave41 soft /captured/; lock Blue distributed 1 cube, captured 6!. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 65 calla — last-move capture six exact', () => {
  it('P1 capture is exact Blue distributed 1 cube, captured 6!', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 1, 0],
      player2Pits: [5, 0, 0, 0, 0],
      player1Calla: 1,
      player2Calla: 0,
    };
    const next = makeMove(state, 3);
    expect(next.moveHistory.at(-1)?.captured).toBe(6);
    expect(getLastMoveInfo(next)).toBe(
      'Blue distributed 1 cube, captured 6!'
    );
  });
});
