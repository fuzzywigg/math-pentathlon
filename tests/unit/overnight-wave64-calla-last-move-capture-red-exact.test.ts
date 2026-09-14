/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla P2 capture last-move exact.
 * Soft /Red distributed/ /captured 5/ in wave50; lock full string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 64 calla — last-move capture Red exact', () => {
  it('locks Red distributed 1 cube, captured 5!', () => {
    const next = makeMove(
      {
        ...createInitialState(),
        currentPlayer: 'player2',
        player2Pits: [1, 0, 0, 0, 2],
        player1Pits: [0, 0, 0, 4, 1],
        player1Calla: 10,
        player2Calla: 3,
      },
      0
    );
    expect(getLastMoveInfo(next)).toBe('Red distributed 1 cube, captured 5!');
  });
});
