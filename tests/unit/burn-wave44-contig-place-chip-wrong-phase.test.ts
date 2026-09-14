/**
 * Wave 44 — Contig placeChip wrong-phase leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — placeChip wrong phase', () => {
  it('identity when rolling or missing dice', () => {
    const s = createInitialState();
    expect(placeChip(s, 1, '1')).toEqual(s);
    const withDice = { ...s, currentDice: [1, 1, 1] as [number, number, number], phase: 'rolling' as const };
    expect(placeChip(withDice, 1, '1')).toEqual(withDice);
  });
});
