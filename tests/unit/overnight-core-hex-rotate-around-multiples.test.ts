/**
 * Overnight TOKENMAXX — rotateAround steps 0/6/-6 identity; 3 is 180°.
 * Beyond wave39 neg steps. Tests-only. After #214/#215.
 */
import { describe, it, expect } from 'vitest';
import { rotateAround, hexEquals, rotateRight } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight core hex — rotateAround multiples', () => {
  it('steps 0, 6, -6, 12 are identity around center', () => {
    const center = createAxial(1, 1);
    const h = createAxial(3, -1);
    for (const steps of [0, 6, -6, 12, -12]) {
      expect(hexEquals(rotateAround(h, center, steps), h)).toBe(true);
    }
  });

  it('3 steps around origin ≡ three rotateRight', () => {
    const h = createAxial(2, -3);
    let expected = h;
    for (let i = 0; i < 3; i++) expected = rotateRight(expected);
    expect(hexEquals(rotateAround(h, createAxial(0, 0), 3), expected)).toBe(
      true
    );
  });

  it('rotating the center around itself is identity for any steps', () => {
    const c = createAxial(-2, 4);
    expect(hexEquals(rotateAround(c, c, 5), c)).toBe(true);
  });
});
