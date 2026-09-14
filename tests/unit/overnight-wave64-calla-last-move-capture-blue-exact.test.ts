/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla P1 capture last-move exact.
 * Soft /captured 5/ elsewhere; lock full Blue capture string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 64 calla — last-move capture Blue exact', () => {
  it('locks Blue distributed 1 cube, captured 5!', () => {
    const next = makeMove(
      {
        ...createInitialState(),
        player1Pits: [1, 0, 0, 0, 0],
        player2Pits: [0, 0, 0, 4, 0],
      },
      0
    );
    expect(getLastMoveInfo(next)).toBe('Blue distributed 1 cube, captured 5!');
  });
});
