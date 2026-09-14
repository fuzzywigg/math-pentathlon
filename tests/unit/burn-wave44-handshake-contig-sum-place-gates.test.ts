/**
 * Wave 44 — Contig × Sum place reject handshake leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';
import { createInitialState as createSum, placeDomino } from '../../src/games/sum-dominoes/rules';

describe('Wave 44 handshake — Contig × Sum place gates', () => {
  it('opening place APIs are identity noops', () => {
    const c = createContig();
    const s = createSum();
    expect(placeChip(c, 1, '1')).toEqual(c);
    expect(placeDomino(s, { row: 0, col: 0 }, 'horizontal')).toEqual(s);
  });
});
