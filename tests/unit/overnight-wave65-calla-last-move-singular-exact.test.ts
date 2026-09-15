/**
 * Wave 65 leftover after tip/#315 — Calla getLastMoveInfo singular cube exact.
 * Wave48 soft /1 cube(?!s)/; lock full Blue distributed 1 cube. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 65 calla — last-move singular exact', () => {
  it('singular distribute is exact Blue distributed 1 cube', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 1],
      player1Calla: 14,
      player2Calla: 14,
    };
    const next = makeMove(s, 0);
    expect(next.moveHistory.at(-1)?.cubesDistributed).toBe(1);
    expect(next.moveHistory.at(-1)?.captured).toBe(0);
    expect(getLastMoveInfo(next)).toBe('Blue distributed 1 cube');
  });
});
