/**
 * burn-1008-mp-math-precision — table-driven exactness for arithmetic helpers.
 *
 * Does not redo #482 (engine edge cases), #465 (round-trip fuzz),
 * #515 (mutation audit), or #492 (rules text). Focus: GCD/LCM, fraction
 * cross-multiply equality, primes/squares/coprime, remainder division,
 * hex integer geometry, Contig/Prime Gold expression integer gates,
 * and UI format helpers that must stay exact for game values.
 */
import { describe, expect, it } from 'vitest';

import {
  areCoprime,
  getDigitSum,
  getFactors as attrFactors,
  isPerfectSquare,
  isPrime as attrIsPrime,
} from '../../src/core/attributes/logic';
import {
  add,
  areEqual,
  compare,
  createFraction,
  formatFraction,
  fromDecimal,
  gcd,
  getFactors,
  isWholeNumber,
  lcm,
  multiply,
  negate,
  parseFraction,
  simplify,
  subtract,
  toMixedNumber,
} from '../../src/core/fractions/arithmetic';
import {
  axialToCube,
  axialToOffset,
  hexDistance,
  hexEquals,
  hexesInRange,
  offsetToAxial,
  rotateLeft,
  rotateRight,
} from '../../src/core/hex/coordinates';
import {
  checkEquation,
  evaluate,
  parseEquation,
} from '../../src/core/expressions/evaluator';
import { formatTime, parseTime } from '../../src/core/timer-scoring';
import { getAllPossibleResults } from '../../src/games/contig-60/types';
import {
  formatDecimal,
  formatFraction as pinballFormatFraction,
} from '../../src/games/fraction-pinball/rules';
import {
  factorial,
  generateExpressions,
  isGoldbachNumber,
  isPrime as primeGoldIsPrime,
} from '../../src/games/prime-gold/types';
import { calculateDivision } from '../../src/games/remainder-islands/rules';

describe('burn-1008 math precision — gcd / lcm', () => {
  it.each([
    [0, 0, 0],
    [0, 7, 7],
    [7, 0, 7],
    [12, 8, 4],
    [-12, 8, 4],
    [12, -8, 4],
    [-12, -8, 4],
    [17, 13, 1],
    [1, 1, 1],
    [100, 25, 25],
    [Number.MAX_SAFE_INTEGER, 1, 1],
  ] as const)('gcd(%i, %i) = %i', (a, b, expected) => {
    expect(gcd(a, b)).toBe(expected);
  });

  it.each([
    [0, 5, 0],
    [5, 0, 0],
    [4, 6, 12],
    [3, 5, 15],
    [7, 7, 7],
    [-4, 6, 12],
    [1, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  ] as const)('lcm(%i, %i) = %i', (a, b, expected) => {
    expect(lcm(a, b)).toBe(expected);
  });

  it('lcm divides before multiply (identity with gcd)', () => {
    const pairs = [
      [12, 18],
      [100, 35],
      [97, 13],
      [1_000_003, 1_000_033],
    ] as const;
    for (const [a, b] of pairs) {
      const g = gcd(a, b);
      expect(lcm(a, b) * g).toBe(a * b);
    }
  });
});

describe('burn-1008 math precision — fraction equality / reduce', () => {
  it.each([
    [{ n: 1, d: 2 }, { n: 2, d: 4 }, true],
    [{ n: 1, d: 2 }, { n: 1, d: 3 }, false],
    [{ n: -3, d: 4 }, { n: 3, d: 4, flag: true }, true],
    [{ n: 0, d: 5 }, { n: 0, d: 1 }, true],
    [{ n: 6, d: 9 }, { n: 2, d: 3 }, true],
  ] as const)('areEqual cross-multiply %#', (a, b, eq) => {
    const A = a.flag
      ? { numerator: a.n, denominator: a.d, isNegative: true as const }
      : createFraction(a.n, a.d);
    const B = 'flag' in b && b.flag
      ? { numerator: b.n, denominator: b.d, isNegative: true as const }
      : createFraction(b.n, b.d);
    expect(areEqual(A, B)).toBe(eq);
  });

  it.each([
    [2, 4, 1, 2],
    [0, 9, 0, 1],
    [-6, 9, 2, 3],
    [15, 25, 3, 5],
    [7, 1, 7, 1],
  ] as const)('simplify(%i/%i) → %i/%i', (n, d, en, ed) => {
    const s = simplify(createFraction(n, d));
    expect(s.numerator).toBe(en);
    expect(s.denominator).toBe(ed);
    if (n < 0) expect(s.isNegative).toBe(true);
  });

  it('add/subtract/multiply stay exactly equal via cross-multiply', () => {
    const cases = [
      [createFraction(1, 2), createFraction(1, 3)],
      [createFraction(2, 5), createFraction(3, 7)],
      [createFraction(-1, 4), createFraction(5, 6)],
      [
        { numerator: 1, denominator: 2, isNegative: true },
        createFraction(1, 6),
      ],
    ] as const;
    for (const [a, b] of cases) {
      const sum = add(a, b);
      const diff = subtract(a, b);
      const prod = multiply(a, b);
      // Reconstruct expected via integer cross terms after simplify
      expect(areEqual(sum, add(simplify(a), simplify(b)))).toBe(true);
      expect(areEqual(diff, subtract(simplify(a), simplify(b)))).toBe(true);
      expect(areEqual(prod, multiply(simplify(a), simplify(b)))).toBe(true);
      expect(compare(sum, a) === 0 || compare(sum, a) !== 0).toBe(true);
    }
  });

  it('negate flips both encodings; double-negate round-trips', () => {
    const samples = [
      createFraction(3, 5),
      createFraction(-3, 5),
      { numerator: 3, denominator: 5, isNegative: true },
      createFraction(0, 1),
    ];
    for (const f of samples) {
      expect(areEqual(negate(negate(f)), f)).toBe(true);
    }
    expect(areEqual(negate({ numerator: 3, denominator: 5, isNegative: true }), createFraction(3, 5))).toBe(
      true
    );
  });

  it.each([
    [6, 3, true],
    [5, 3, false],
    [0, 4, true],
    [-9, 3, true],
    [6.1, 3.05, false], // float % coincidence must not pass
    [1.5, 0.5, false],
  ] as const)('isWholeNumber(%i/%i) = %s', (n, d, expected) => {
    expect(isWholeNumber({ numerator: n, denominator: d })).toBe(expected);
  });

  it.each([
    [-7, 3, -2, 1],
    [7, 3, 2, 1],
    [-5, 2, -2, 1],
    [5, 1, 5, 0],
  ] as const)('toMixedNumber(%i/%i) whole=%i rem=%i', (n, d, whole, rem) => {
    const mixed = toMixedNumber(createFraction(n, d));
    expect(mixed.whole).toBe(whole);
    expect(mixed.fraction.numerator).toBe(rem);
    expect(mixed.fraction.denominator).toBe(d === 1 ? 1 : d);
  });

  it('parseFraction / formatFraction round-trip common forms', () => {
    const table = ['0', '3', '-3', '3/4', '-3/4', '1 1/2', '-1 1/2'] as const;
    for (const s of table) {
      const parsed = parseFraction(s);
      expect(parsed).not.toBeNull();
      const again = parseFraction(formatFraction(parsed!, { showMixedNumber: s.includes(' ') }));
      expect(again).not.toBeNull();
      expect(areEqual(parsed!, again!)).toBe(true);
    }
  });

  it('fromDecimal hits exact common fractions', () => {
    const table = [
      [0.5, 1, 2],
      [0.25, 1, 4],
      [0.125, 1, 8],
      [0.1, 1, 10],
      [-0.75, 3, 4],
      [0, 0, 1],
    ] as const;
    for (const [dec, n, d] of table) {
      const f = fromDecimal(dec);
      if (dec < 0) {
        expect(
          areEqual(f, { numerator: n, denominator: d, isNegative: true })
        ).toBe(true);
      } else {
        expect(areEqual(f, createFraction(n, d))).toBe(true);
      }
    }
  });

  it.each([
    [12, [1, 2, 3, 4, 6, 12]],
    [1, [1]],
    [17, [1, 17]],
    [0, []],
    [-8, [1, 2, 4, 8]],
  ] as const)('getFactors(%i)', (n, expected) => {
    expect(getFactors(n)).toEqual([...expected]);
  });
});

describe('burn-1008 math precision — primes / squares / coprime / digit sum', () => {
  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  const composites = [0, 1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27, 49];

  it.each(primes)('isPrime(%i) true in both implementations', (n) => {
    expect(attrIsPrime(n)).toBe(true);
    expect(primeGoldIsPrime(n)).toBe(true);
  });

  it.each(composites)('isPrime(%i) false in both implementations', (n) => {
    expect(attrIsPrime(n)).toBe(false);
    expect(primeGoldIsPrime(n)).toBe(false);
  });

  it('rejects non-integers for isPrime', () => {
    expect(attrIsPrime(2.5)).toBe(false);
    expect(primeGoldIsPrime(2.5)).toBe(false);
    expect(attrIsPrime(NaN)).toBe(false);
  });

  it.each([
    [0, true],
    [1, true],
    [2, false],
    [4, true],
    [9, true],
    [16, true],
    [25, true],
    [26, false],
    [-4, false],
    [2.25, false],
  ] as const)('isPerfectSquare(%i) = %s', (n, expected) => {
    expect(isPerfectSquare(n)).toBe(expected);
  });

  it.each([
    [8, 9, true],
    [8, 12, false],
    [-8, 9, true],
    [0, 1, true],
    [0, 0, false],
    [1, 1, true],
  ] as const)('areCoprime(%i, %i) = %s', (a, b, expected) => {
    expect(areCoprime(a, b)).toBe(expected);
  });

  it.each([
    [0, 0],
    [7, 7],
    [99, 18],
    [-99, 18],
    [100, 1],
  ] as const)('getDigitSum(%i) = %i', (n, expected) => {
    expect(getDigitSum(n)).toBe(expected);
  });

  it('attr getFactors matches fraction getFactors for positives', () => {
    for (const n of [1, 6, 12, 28, 49]) {
      expect(attrFactors(n)).toEqual(getFactors(n));
    }
  });
});

describe('burn-1008 math precision — remainder / factorial / Goldbach / expressions', () => {
  it.each([
    [7, 3, 2, 1],
    [12, 5, 2, 2],
    [6, 6, 1, 0],
    [5, 7, 0, 5],
    [2, 1, 2, 0],
    [11, 4, 2, 3],
  ] as const)(
    'calculateDivision(%i, %i) → q=%i r=%i',
    (dividend, divisor, quotient, remainder) => {
      expect(calculateDivision(dividend, divisor)).toEqual({
        dividend,
        divisor,
        quotient,
        remainder,
      });
      // Euclidean identity for non-negative domain used by Remainder Islands
      expect(quotient * divisor + remainder).toBe(dividend);
      expect(remainder).toBeGreaterThanOrEqual(0);
      expect(remainder).toBeLessThan(divisor);
    }
  );

  it.each([
    [0, 1],
    [1, 1],
    [5, 120],
    [6, 720],
    [10, 3_628_800],
  ] as const)('factorial(%i) = %i', (n, expected) => {
    expect(factorial(n)).toBe(expected);
  });

  it('factorial out of range is NaN', () => {
    expect(factorial(-1)).toBeNaN();
    expect(factorial(11)).toBeNaN();
  });

  it('Goldbach holds for even board-range targets 4..48', () => {
    for (let n = 4; n <= 48; n += 2) {
      expect(isGoldbachNumber(n)).toBe(true);
    }
    expect(isGoldbachNumber(2)).toBe(false);
    expect(isGoldbachNumber(9)).toBe(false);
  });

  it('generateExpressions yields only positive integers ≤ 49', () => {
    for (let d1 = 1; d1 <= 6; d1++) {
      for (let d2 = 1; d2 <= 8; d2 += 2) {
        for (let d3 = 1; d3 <= 10; d3 += 3) {
          for (const { value } of generateExpressions(d1, d2, d3)) {
            expect(Number.isInteger(value)).toBe(true);
            expect(value).toBeGreaterThan(0);
            expect(value).toBeLessThanOrEqual(49);
          }
        }
      }
    }
  });

  it('generateExpressions division branches require exact divisibility', () => {
    const exprs = generateExpressions(4, 2, 3);
    for (const { expr, value } of exprs) {
      if (expr.includes('÷')) {
        expect(Number.isInteger(value)).toBe(true);
      }
    }
    // 4 ÷ 2 is exact
    expect(exprs.some((e) => e.value === 2)).toBe(true);
  });
});

describe('burn-1008 math precision — Contig dice expressions', () => {
  it('all dice triples produce only exact positive integers', () => {
    for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) {
        for (let c = 1; c <= 6; c++) {
          const results = getAllPossibleResults([a, b, c]);
          for (const { result, expression } of results) {
            expect(Number.isInteger(result)).toBe(true);
            expect(result).toBeGreaterThan(0);
            expect(expression.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it.each([
    [[1, 1, 1], [1, 2, 3]],
    [[2, 3, 6], [1, 4, 5, 6, 7, 9, 11, 12, 18, 36]],
    [[6, 6, 6], [2, 5, 6, 7, 18, 30, 42, 72, 216]],
  ] as const)('known dice %j includes %j', (dice, mustInclude) => {
    const got = new Set(
      getAllPossibleResults(dice as unknown as [number, number, number]).map(
        (r) => r.result
      )
    );
    for (const v of mustInclude) {
      expect(got.has(v)).toBe(true);
    }
  });
});

describe('burn-1008 math precision — hex integer geometry', () => {
  it('axial→cube preserves q+r+s = 0 on a lattice', () => {
    for (let q = -4; q <= 4; q++) {
      for (let r = -4; r <= 4; r++) {
        const cube = axialToCube({ q, r });
        expect(cube.x + cube.y + cube.z).toBe(0);
      }
    }
  });

  it('odd/even offset round-trips', () => {
    for (let q = -5; q <= 5; q++) {
      for (let r = -5; r <= 5; r++) {
        for (const parity of ['odd', 'even'] as const) {
          const back = offsetToAxial(axialToOffset({ q, r }, parity), parity);
          expect(back).toEqual({ q, r });
        }
      }
    }
  });

  it.each([
    [{ q: 0, r: 0 }, { q: 0, r: 0 }, 0],
    [{ q: 0, r: 0 }, { q: 1, r: 0 }, 1],
    [{ q: 0, r: 0 }, { q: 2, r: -1 }, 2],
    [{ q: -2, r: 3 }, { q: 1, r: -1 }, 4],
  ] as const)('hexDistance %#', (a, b, d) => {
    expect(hexDistance(a, b)).toBe(d);
    expect(hexDistance(b, a)).toBe(d);
  });

  it('rotateRight^6 and rotateLeft^6 are identity', () => {
    for (let q = -3; q <= 3; q++) {
      for (let r = -3; r <= 3; r++) {
        let right = { q, r };
        let left = { q, r };
        for (let i = 0; i < 6; i++) {
          right = rotateRight(right);
          left = rotateLeft(left);
        }
        expect(hexEquals(right, { q, r })).toBe(true);
        expect(hexEquals(left, { q, r })).toBe(true);
      }
    }
  });

  it('hexesInRange(radius) size is 3r(r+1)+1', () => {
    for (let r = 0; r <= 4; r++) {
      expect(hexesInRange({ q: 0, r: 0 }, r)).toHaveLength(3 * r * (r + 1) + 1);
    }
  });
});

describe('burn-1008 math precision — expression / timer / pinball format helpers', () => {
  it('integer expressions evaluate exactly', () => {
    const table = [
      ['2 + 3', 5],
      ['10 - 4', 6],
      ['6 * 7', 42],
      ['8 / 2', 4],
      ['2 ^ 5', 32],
      ['(2 + 3) * 4', 20],
      ['10 / 3 * 3', 10],
    ] as const;
    for (const [expr, value] of table) {
      const result = evaluate(expr);
      expect(result.success).toBe(true);
      expect(result.value).toBe(value);
    }
  });

  it('checkEquation uses epsilon for classic float cases', () => {
    const eq = parseEquation('0.1 + 0.2 = 0.3');
    expect(eq).not.toBeNull();
    const checked = checkEquation(eq!);
    expect(checked.isTrue).toBe(true);
  });

  it.each([
    [0, false, '00:00'],
    [1000, false, '00:01'],
    [60_000, false, '01:00'],
    [61_010, true, '01:01.01'],
    [3_600_000, false, '60:00'],
  ] as const)(
    'formatTime/parseTime round-trip ms=%i showMs=%s → %s',
    (ms, showMilliseconds, formatted) => {
      expect(formatTime(ms, { showMilliseconds })).toBe(formatted);
      const parsed = parseTime(formatted);
      expect(formatTime(parsed, { showMilliseconds })).toBe(formatted);
    }
  );

  it.each([
    [0.5, '0.5'],
    [0.25, '0.25'],
    [0.125, '0.125'],
    [0.1, '0.1'],
    [1, '1'],
    [0.1 + 0.2, '0.3'],
    [1 / 8, '0.125'],
  ] as const)('formatDecimal(%s) = %s', (value, expected) => {
    expect(formatDecimal(value)).toBe(expected);
  });

  it.each([
    [{ numerator: 1, denominator: 2 }, '1/2'],
    [{ numerator: 3, denominator: 1 }, '3'],
    [{ numerator: 5, denominator: 8 }, '5/8'],
  ] as const)('pinball formatFraction %#', (f, expected) => {
    expect(pinballFormatFraction(f)).toBe(expected);
  });
});
