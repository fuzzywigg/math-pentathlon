/**
 * Wave 44 — Contig placeChip clears expression leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — place clears expression', () => {
  it('nulls currentExpression after place', () => {
    const next = placeChip(
      {
        ...createInitialState(),
        phase: 'calculating',
        currentDice: [2, 3, 4],
        currentExpression: 'draft',
      },
      24,
      '2*3*4'
    );
    expect(next.currentExpression).toBeNull();
  });
});
