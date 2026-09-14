/**
 * Wave 44 — Contig checkWinner partial null leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — winner partial null', () => {
  it('four-in-a-row is not enough', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const v of [1, 2, 3, 4]) cells.set(v, { ...cells.get(v)!, owner: 'player1' });
    expect(checkWinner({ ...base, cells })).toBeNull();
  });
});
