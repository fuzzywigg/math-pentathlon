/**
 * Wave 36 — fraction arithmetic leftover handshake (NOT fraction-bar-ui).
 * Distinct from open #164/#165 frac UI burns; pairs with storage/timer prefer list.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createFraction,
  add,
  subtract,
  multiply,
  divide,
  simplify,
  toMixedNumber,
  compare,
  areEqual,
  toDecimal,
  COMMON_FRACTIONS,
} from '../../src/core/fractions';
import {
  createScoringState,
  addScore,
  getPlayerScore,
} from '../../src/core/timer-scoring';

describe('Wave 36 frac-arith — common catalog ops with score bridge', () => {
  it('adds COMMON_FRACTIONS halves/quarters into scoring points', () => {
    const half = COMMON_FRACTIONS.find((f) => f.denominator === 2)!;
    const quarter = COMMON_FRACTIONS.find(
      (f) => f.numerator === 1 && f.denominator === 4
    )!;
    const sum = simplify(add(half, quarter));
    expect(areEqual(sum, createFraction(3, 4))).toBe(true);

    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', Math.round(toDecimal(sum) * 100));
    expect(getPlayerScore(state, 'p1')).toBe(75);
  });

  it('mixed number path for improper results', () => {
    const a = createFraction(5, 3);
    const b = createFraction(4, 3);
    const s = add(a, b);
    const mixed = toMixedNumber(simplify(s));
    expect(mixed.whole).toBe(3);
    expect(mixed.fraction.numerator).toBe(0);
  });

  it('compare / subtract / multiply / divide sanity grid', () => {
    const samples = [
      createFraction(1, 2),
      createFraction(2, 3),
      createFraction(3, 4),
      createFraction(-1, 5),
      createFraction(0, 7),
    ];
    for (const a of samples) {
      for (const b of samples) {
        const cmp = compare(a, b);
        expect([-1, 0, 1]).toContain(cmp);
        if (areEqual(a, b)) expect(cmp).toBe(0);
        const diff = subtract(a, b);
        expect(Number.isFinite(toDecimal(diff))).toBe(true);
        const prod = multiply(a, b);
        expect(prod.denominator).not.toBe(0);
        if (b.numerator !== 0) {
          const q = divide(a, b);
          expect(q.denominator).not.toBe(0);
        }
      }
    }
  });
});
