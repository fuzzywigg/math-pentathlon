/**
 * Overnight TOKENMAXX — rotateAround / reflect composition leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  rotateRight,
  rotateLeft,
  rotateAround,
  reflect,
  hexEquals,
  hexDistance,
} from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';

describe('Overnight hex — rotate/reflect compose', () => {
  it('six rotateRight returns identity; left is inverse', () => {
    const p = createAxial(3, -1);
    let cur = p;
    for (let i = 0; i < 6; i++) cur = rotateRight(cur);
    expect(hexEquals(cur, p)).toBe(true);
    expect(hexEquals(rotateLeft(rotateRight(p)), p)).toBe(true);
  });

  it('rotateAround steps preserve distance to center', () => {
    const center = createAxial(1, -2);
    const p = createAxial(4, -2);
    const d = hexDistance(center, p);
    for (let s = 0; s < 6; s++) {
      const r = rotateAround(p, center, s);
      expect(hexDistance(center, r)).toBe(d);
    }
    expect(hexEquals(rotateAround(p, center, 6), p)).toBe(true);
    expect(hexEquals(rotateAround(p, center, -1), rotateAround(p, center, 5))).toBe(true);
  });

  it('reflect twice on same axis is identity', () => {
    const p = createAxial(2, -3);
    for (const axis of ['q', 'r', 's'] as const) {
      expect(hexEquals(reflect(reflect(p, axis), axis), p)).toBe(true);
    }
  });
});
