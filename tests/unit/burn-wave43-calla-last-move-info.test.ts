/**
 * Wave 43 — Calla getLastMoveInfo pluralization / null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 43 calla — last move info', () => {
  it('null on empty history; plural cubes after opening sow', () => {
    const open = createInitialState();
    expect(getLastMoveInfo(open)).toBeNull();
    const next = makeMove(open, 1);
    const info = getLastMoveInfo(next)!;
    expect(info).toContain('Blue');
    expect(info).toContain('3 cubes');
  });

  it('singular cube wording when one cube sown', () => {
    const state = {
      ...createInitialState(),
      player1Pits: [0, 0, 0, 0, 1],
      player2Pits: [1, 1, 1, 1, 1],
    };
    const next = makeMove(state, 4);
    expect(getLastMoveInfo(next)).toContain('1 cube');
  });
});
