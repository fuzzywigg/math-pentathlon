/**
 * Wave 44 — Contig calculatePoints isolated leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — calculatePoints isolated', () => {
  it('empty board yields 0; missing value yields 0', () => {
    const s = createInitialState();
    expect(calculatePoints(s, 1)).toBe(0);
    expect(calculatePoints(s, 9999)).toBe(0);
  });
});
