/**
 * Overnight TOKENMAXX — FIAR getValidMoves ghost leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { getValidMoves, placeChip } from '../../src/games/fiar/rules';

describe('Overnight fiar — valid moves ghost', () => {
  it('ghost node yields empty moves in movement', () => {
    let s = createInitialState();
    // Place 4+4 chips to enter movement
    const nodes = ['0-0', '0-1', '0-2', '0-3', '1-0', '1-1', '1-2', '1-3'];
    for (const n of nodes) s = placeChip(s, n);
    expect(s.phase).toBe('movement');
    expect(getValidMoves(s, 'ghost')).toEqual([]);
  });
});
