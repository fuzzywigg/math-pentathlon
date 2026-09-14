/**
 * Wave 63 leftover after tip/#301 — Calla getLastMoveInfo Free turn exact.
 * Tightens wave52 soft /Free turn!/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 63 calla — last-move free-turn exact', () => {
  it('opening pit 2 is exact Blue distributed 3 cubes Free turn!', () => {
    const next = makeMove(createInitialState(), 2);
    expect(next.moveHistory.at(-1)?.gotFreeTurn).toBe(true);
    expect(getLastMoveInfo(next)).toBe('Blue distributed 3 cubes Free turn!');
  });
});
