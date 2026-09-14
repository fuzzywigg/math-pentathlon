/**
 * Wave 39 — hexRing radius 0 + hexLine n=0 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  hexRing,
  hexLine,
  hexEquals,
  hexSpiral,
} from '../../src/core/hex';

describe('Wave 39 hex — ring0 / line0', () => {
  const c = createAxial(1, -2);

  it('hexRing radius 0 returns center only', () => {
    const ring = hexRing(c, 0);
    expect(ring).toHaveLength(1);
    expect(hexEquals(ring[0], c)).toBe(true);
  });

  it('hexLine same point returns singleton', () => {
    const line = hexLine(c, c);
    expect(line).toHaveLength(1);
    expect(hexEquals(line[0], c)).toBe(true);
  });

  it('hexRing radius 1 has 6 cells; spiral includes center', () => {
    expect(hexRing(c, 1)).toHaveLength(6);
    const spiral = hexSpiral(c, 1);
    expect(spiral).toHaveLength(7);
    expect(hexEquals(spiral[0], c)).toBe(true);
  });
});
