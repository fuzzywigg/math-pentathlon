/**
 * Overnight HEAVY leftover after #234 — Calla free-turn last-move wording residual. Tests-only.
 * Complements wave48 singular-cube wording with Free turn! branch.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 52 calla — free-turn last-move info', () => {
  it('appends Free turn! when last cube lands in calla', () => {
    // Opening pit 2 has 3 cubes → lands in calla (positions 3,4,calla)
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory.at(-1)?.gotFreeTurn).toBe(true);
    expect(getLastMoveInfo(next)).toMatch(/Free turn!/);
  });
});
