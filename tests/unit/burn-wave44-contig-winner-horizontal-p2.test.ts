/**
 * Wave 44 — Contig horizontal five for player2 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — winner horizontal p2', () => {
  it('top-row five awards player2', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const v of [1, 2, 3, 4, 5]) {
      cells.set(v, { ...cells.get(v)!, owner: 'player2' });
    }
    expect(checkWinner({ ...base, cells })).toBe('player2');
  });
});
