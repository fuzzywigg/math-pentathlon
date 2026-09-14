/**
 * Wave 44 — Contig points ignore empty neighbors leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — calculatePoints unowned adj', () => {
  it('unowned adjacent numbers do not score', () => {
    // Cell 5 neighbors include empty-owned cells only
    expect(calculatePoints(createInitialState(), 5)).toBe(0);
  });
});
