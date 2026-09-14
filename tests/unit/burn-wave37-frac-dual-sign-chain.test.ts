/**
 * Wave 37 — fraction dual-sign compare / chain leftover stress.
 * Beyond wave 27 sign-dual. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  compare,
  areEqual,
  add,
  subtract,
  multiply,
  min,
  max,
  abs,
} from '../../src/core/fractions';

const F = createFraction;
const flag = (n: number, d: number) =>
  ({ numerator: n, denominator: d, isNegative: true }) as const;

describe('Wave 37 frac-dual-chain — compare across encodings', () => {
  it('signed and flag forms compare equal and order identically vs positives', () => {
    const samples = [
      [F(-1, 2), flag(1, 2)],
      [F(-3, 4), flag(3, 4)],
      [F(-5, 8), flag(5, 8)],
    ] as const;
    for (const [signed, flagged] of samples) {
      expect(compare(signed, flagged)).toBe(0);
      expect(areEqual(signed, flagged)).toBe(true);
      expect(compare(signed, F(1, 10))).toBe(-1);
      expect(compare(flagged, F(1, 10))).toBe(-1);
      expect(compare(F(1, 10), signed)).toBe(1);
    }
  });

  it('add/sub/mul of dual forms agree under equality', () => {
    const a = F(-2, 5);
    const af = flag(2, 5);
    const b = F(3, 7);
    expect(areEqual(add(a, b), add(af, b))).toBe(true);
    expect(areEqual(subtract(b, a), subtract(b, af))).toBe(true);
    expect(areEqual(multiply(a, b), multiply(af, b))).toBe(true);
  });

  it('min/max over mixed encodings pick correct extremes', () => {
    const list = [F(1, 2), flag(3, 4), F(-1, 8), F(2, 3)];
    expect(areEqual(min(...list), flag(3, 4))).toBe(true);
    expect(areEqual(max(...list), F(2, 3))).toBe(true);
    expect(areEqual(abs(min(...list)), F(3, 4))).toBe(true);
  });
});
