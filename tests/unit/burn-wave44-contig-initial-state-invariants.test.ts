/**
 * Wave 44 — Contig createInitialState leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — initial state invariants', () => {
  it('opens rolling with empty scores/history', () => {
    const s = createInitialState();
    expect(s.phase).toBe('rolling');
    expect(s.currentPlayer).toBe('player1');
    expect(s.scores).toEqual({ player1: 0, player2: 0 });
    expect(s.moveHistory).toEqual([]);
    expect(s.winner).toBeNull();
    expect(s.currentDice).toBeNull();
  });
});
