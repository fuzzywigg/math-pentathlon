/**
 * Wave 58 Contig/SD residual — Contig placeChip wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 58 contig — place wrong phase', () => {
  it('returns same reference when rolling', () => {
    const state = createInitialState();
    expect(placeChip(state, 12, '(1 + 2) * 4')).toBe(state);
  });
});
