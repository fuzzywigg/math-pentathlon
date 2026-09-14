/**
 * Wave 45 — Sum shuffleArray identity on singleton
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../../src/games/sum-dominoes/types';

describe('Wave 45 Sum types — shuffle singleton', () => {
  it('returns a copy of a one-element array', () => {
    const src = [42];
    const out = shuffleArray(src);
    expect(out).toEqual([42]);
    expect(out).not.toBe(src);
  });
});
