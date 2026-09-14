/**
 * Wave 42 — Queens & Guards cellsInRing counts leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { cellsInRing, CONFIG } from '../../src/games/queens-guards/types';

describe('Wave 42 queens — cellsInRing', () => {
  it('ring 0 has exactly one cell (throne)', () => {
    expect(cellsInRing(0)).toBe(1);
  });

  it('ring 1 has six cells', () => {
    expect(cellsInRing(1)).toBe(6);
  });

  it('outer ring has 6 * (NUM_RINGS - 1) cells', () => {
    const outer = CONFIG.NUM_RINGS - 1;
    expect(cellsInRing(outer)).toBe(6 * outer);
    expect(cellsInRing(outer)).toBe(30);
  });

  it('mid rings scale linearly: ring n has 6n cells for n > 0', () => {
    for (let ring = 2; ring < CONFIG.NUM_RINGS; ring++) {
      expect(cellsInRing(ring)).toBe(6 * ring);
    }
  });
});
