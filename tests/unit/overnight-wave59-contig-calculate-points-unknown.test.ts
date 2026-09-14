/**
 * Wave 59 Contig/SD residual — Contig calculatePoints unknown value. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 59 contig — points unknown', () => {
  it('returns 0 for value not on board', () => {
    expect(calculatePoints(createInitialState(), 999)).toBe(0);
  });
});
