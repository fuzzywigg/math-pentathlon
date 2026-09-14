/**
 * Wave 64 leftover after tip/#303 — Calla getLastMoveInfo Red capture exact.
 * Wave50 soft-matched Red/captured; lock full exact string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 64 calla — last-move red capture exact', () => {
  it('P2 capture is exact Red distributed 1 cube, captured 5!', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      player2Pits: [1, 0, 0, 0, 2],
      player1Pits: [0, 0, 0, 4, 1],
      player1Calla: 10,
      player2Calla: 3,
    };
    const next = makeMove(state, 0);
    expect(next.moveHistory.at(-1)?.player).toBe('player2');
    expect(next.moveHistory.at(-1)?.captured).toBe(5);
    expect(getLastMoveInfo(next)).toBe(
      'Red distributed 1 cube, captured 5!'
    );
  });
});
