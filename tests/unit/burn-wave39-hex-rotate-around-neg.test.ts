/**
 * Wave 39 — rotateAround negative steps + reflect axes leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createAxial,
  rotateAround,
  reflect,
  hexEquals,
  getNeighbor,
} from '../../src/core/hex';

describe('Wave 39 hex — rotateAround neg / reflect', () => {
  const center = createAxial(0, 0);
  const pt = createAxial(2, 0);

  it('negative steps normalize via mod 6', () => {
    const cw5 = rotateAround(pt, center, 5);
    const ccw1 = rotateAround(pt, center, -1);
    expect(hexEquals(cw5, ccw1)).toBe(true);
  });

  it('6 steps is identity', () => {
    expect(hexEquals(rotateAround(pt, center, 6), pt)).toBe(true);
    expect(hexEquals(rotateAround(pt, center, -6), pt)).toBe(true);
  });

  it('reflect q/r/s produce distinct coords for off-axis hex', () => {
    const h = createAxial(2, -1);
    const rq = reflect(h, 'q');
    const rr = reflect(h, 'r');
    const rs = reflect(h, 's');
    expect(hexEquals(rq, rr)).toBe(false);
    expect(hexEquals(rr, rs)).toBe(false);
    expect(hexEquals(rq, rs)).toBe(false);
  });

  it('getNeighbor large direction wraps mod 6', () => {
    const origin = createAxial(0, 0);
    expect(hexEquals(getNeighbor(origin, 6), getNeighbor(origin, 0))).toBe(
      true
    );
    expect(hexEquals(getNeighbor(origin, 7), getNeighbor(origin, 1))).toBe(
      true
    );
  });
});
