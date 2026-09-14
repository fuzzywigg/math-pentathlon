/**
 * Wave 44 — Contig hasValidMoves true leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — hasValidMoves true', () => {
  it('true with open board and productive dice', () => {
    const s = {
      ...createInitialState(),
      currentDice: [2, 3, 4] as [number, number, number],
      phase: 'calculating' as const,
    };
    expect(hasValidMoves(s)).toBe(true);
  });
});
