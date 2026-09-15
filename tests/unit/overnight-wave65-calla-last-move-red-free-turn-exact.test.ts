/**
 * Wave 65 leftover after tip/#315 — Calla getLastMoveInfo Red free-turn exact.
 * Blue free-turn exact (wave63); Red capture exact (wave64); Red free-turn absent.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 65 calla — last-move red free-turn exact', () => {
  it('P2 pit 2 is exact Red distributed 3 cubes Free turn!', () => {
    const next = makeMove(
      { ...createInitialState(), currentPlayer: 'player2' },
      2
    );
    expect(next.moveHistory.at(-1)?.player).toBe('player2');
    expect(next.moveHistory.at(-1)?.gotFreeTurn).toBe(true);
    expect(getLastMoveInfo(next)).toBe(
      'Red distributed 3 cubes Free turn!'
    );
  });
});
