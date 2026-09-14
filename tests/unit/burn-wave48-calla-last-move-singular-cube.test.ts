/**
 * Wave 48 — Calla getLastMoveInfo singular cube wording. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 48 calla — last move singular', () => {
  it('uses singular cube when distributing exactly one', () => {
    const s = {
      ...createInitialState(),
      player1Pits: [1, 0, 0, 0, 0],
      player2Pits: [0, 0, 0, 0, 1],
      player1Calla: 14,
      player2Calla: 14,
    };
    const next = makeMove(s, 0);
    const info = getLastMoveInfo(next);
    expect(info).toMatch(/1 cube(?!s)/);
  });
});
