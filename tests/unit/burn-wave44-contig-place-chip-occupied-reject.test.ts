/**
 * Wave 44 — Contig placeChip occupied leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — placeChip occupied reject', () => {
  it('rejects already-owned and missing values', () => {
    let s = createInitialState();
    const cells = new Map(s.cells);
    cells.set(1, { ...cells.get(1)!, owner: 'player2' });
    s = { ...s, cells, phase: 'calculating', currentDice: [1, 1, 1] };
    expect(placeChip(s, 1, '1')).toEqual(s);
    expect(placeChip(s, 999, '999')).toEqual(s);
  });
});
