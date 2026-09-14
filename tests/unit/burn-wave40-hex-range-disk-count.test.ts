/**
 * Wave 40 — hexesInRange disk count leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  hexesInRange,
  hexEquals,
  hexDistance,
} from '../../src/core/hex';

describe('Wave 40 hex — range disk count', () => {
  const c = createAxial(2, -3);

  it('range 0 is center; formula 3r(r+1)+1 for r=1,2', () => {
    const r0 = hexesInRange(c, 0);
    expect(r0).toHaveLength(1);
    expect(hexEquals(r0[0], c)).toBe(true);
    expect(hexesInRange(c, 1)).toHaveLength(7);
    expect(hexesInRange(c, 2)).toHaveLength(19);
  });

  it('every cell in range is within distance', () => {
    const r = 2;
    for (const h of hexesInRange(c, r)) {
      expect(hexDistance(c, h)).toBeLessThanOrEqual(r);
    }
  });
});
