/**
 * Wave 48 — Calla player2 sow flips seat without free turn. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';

describe('Wave 48 calla — p2 sow seat flip', () => {
  it('p2 non-calla land flips to player1', () => {
    const s = { ...createInitialState(), currentPlayer: 'player2' as const };
    // pit 0 with 3 cubes: positions 1,2,3 — lands own pit, no free turn
    const next = makeMove(s, 0);
    expect(next.moveHistory[0].player).toBe('player2');
    expect(next.moveHistory[0].gotFreeTurn).toBe(false);
    expect(next.currentPlayer).toBe('player1');
  });
});
