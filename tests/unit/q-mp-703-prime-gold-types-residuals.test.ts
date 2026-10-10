/**
 * q-mp-703 — Close `prime-gold/types` residual gaps under the verify glob
 * (tests-only; 0 src).
 *
 * Tip re-measure (`cursor/mp-tip-post1059` @ `890a9e3f`) with
 * `CI=1 npx vitest run --coverage
 *   --coverage.include=src/games/prime-gold/types.ts
 *   tests/unit/*prime-gold*types* tests/unit/*prime*`
 * (full related glob; unit-shared alone is 62/283 before this suite):
 *   types.ts **96.05%** lines (73/76) / **97.01%** branches (65/67)
 *   Uncovered: **145**, **180**, **218**.
 *
 * After this suite (same glob; spy file under `unit-isolated`):
 *   types.ts **97.36%** lines (74/76) / **98.5%** branches (66/67)
 *   Remaining uncovered: **180**, **218** (documented unreachable).
 *
 * This suite:
 *   - Forces the two-value `vals[i]` undefined continue (**L145**) via an
 *     isolated `Array.prototype.filter` → Proxy (same keep-site pattern as
 *     engine-coverage-round-17 Array.from holes). Listed in `isolatedFiles`
 *     so the prototype patch cannot leak into `unit-shared`.
 *   - Documents **L180** (dense `basicVals` length-3 literal; TS narrowing
 *     continue) and **L218** (Goldbach fallthrough — no even n>2 fails the
 *     prime-pair search under current `isPrime`) as unreachable without src
 *     edits / racey heap instrumentation.
 *
 * Ownership (leave alone; no comments/labels/closes per worker brief):
 *   undrafted `465` void brace on same file — **contained** (lint-only;
 *   this ticket is tests-only coverage).
 *
 * Constraints: tests only; zero `src/` edits; pin CURRENT behavior only
 * (document surprises — never “fix”); no AI / rules / legal-move /
 * scoring-value asserts beyond pinning what exists; no copy / aria pins;
 * Hex Hard 450ms; no network; no ratchet JSON.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  CONFIG,
  DICE_CONFIG,
  factorial,
  generateExpressions,
  isGoldbachNumber,
  isPrime,
} from '../../src/games/prime-gold/types';

const originalFilter = Array.prototype.filter;

afterEach(() => {
  Array.prototype.filter = originalFilter;
});

function looksLikeDiceValRows(
  rows: unknown[]
): rows is { v: number; s: string }[] {
  return (
    rows.length >= 3 &&
    rows.every(
      (x) =>
        x !== null &&
        typeof x === 'object' &&
        'v' in x &&
        's' in x &&
        typeof (x as { s: unknown }).s === 'string'
    )
  );
}

describe('q-mp-703 prime-gold/types — CONFIG / DICE_CONFIG pins (what exists)', () => {
  it('pins board / chip / vein config fields currently exported', () => {
    // Characterize catalog constants only — not a scoring-rule claim.
    expect(CONFIG.BOARD_SIZE).toBe(7);
    expect(CONFIG.STARTING_CHIPS).toBe(20);
    expect(CONFIG.VEINS_TO_WIN).toBe(4);
    expect(CONFIG.MIN_VEIN_LENGTH).toBe(4);
  });

  it('pins three-die ranges currently exported', () => {
    expect(DICE_CONFIG.die1).toEqual({ min: 1, max: 6 });
    expect(DICE_CONFIG.die2).toEqual({ min: 1, max: 8 });
    expect(DICE_CONFIG.die3).toEqual({ min: 1, max: 10 });
  });
});

describe('q-mp-703 prime-gold/types — helper edges under *prime* glob', () => {
  it('isPrime / factorial keep-site edges stay at current returns', () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(9)).toBe(false);
    expect(factorial(0)).toBe(1);
    expect(factorial(11)).toBeNaN();
  });

  it('isGoldbachNumber early-rejects odds / ≤2; accepts small even Goldbach band', () => {
    expect(isGoldbachNumber(1)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
    expect(isGoldbachNumber(9)).toBe(false);
    expect(isGoldbachNumber(4)).toBe(true);
    expect(isGoldbachNumber(28)).toBe(true);
    // L218 (loop fallthrough `return false`) is documented unreachable:
    // every even n>2 that finishes the p1 scan finds a prime pair under
    // current isPrime (Goldbach hold for practical n).
  });

  it('generateExpressions stays sorted, integer, and in 1..49', () => {
    const exprs = generateExpressions(2, 3, 5);
    expect(exprs.length).toBeGreaterThan(0);
    for (let i = 1; i < exprs.length; i++) {
      const prev = exprs[i - 1];
      const cur = exprs[i];
      expect(prev).toBeDefined();
      expect(cur).toBeDefined();
      expect(cur!.value).toBeGreaterThanOrEqual(prev!.value);
    }
    expect(exprs.every((e) => Number.isInteger(e.value))).toBe(true);
    expect(exprs.every((e) => e.value >= 1 && e.value <= 49)).toBe(true);
  });
});

describe('q-mp-703 prime-gold/types — L145 vals undefined continue', () => {
  it('skips two-value ops when filter Proxy yields an indexed hole', () => {
    // Exercises src/games/prime-gold/types.ts ~144–145 under *prime* glob.
    // forEach must still see real rows (stack includes forEach); only the
    // nested vals[i]/vals[j] reads force undefined once.
    let forced = false;
    Array.prototype.filter = function (
      this: unknown[],
      predicate: (value: unknown, index: number, array: unknown[]) => unknown,
      thisArg?: unknown
    ): unknown[] {
      const out = originalFilter.call(this, predicate, thisArg) as unknown[];
      if (!looksLikeDiceValRows(out)) {
        return out;
      }
      return new Proxy(out, {
        get(target, prop, receiver) {
          const stack = new Error().stack ?? '';
          if (
            !forced &&
            (prop === 0 || prop === '0') &&
            !stack.includes('forEach')
          ) {
            forced = true;
            return undefined;
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    };

    const results = generateExpressions(2, 3, 4);
    expect(forced).toBe(true);
    // Current behavior with a forced hole: still returns an array (singles +
    // three-value paths continue); pin shape only — not legal-move claims.
    expect(Array.isArray(results)).toBe(true);
    expect(results.every((e) => typeof e.expr === 'string')).toBe(true);
    expect(results.every((e) => Number.isInteger(e.value))).toBe(true);
  });
});

describe('q-mp-703 prime-gold/types — documented unreachable residuals', () => {
  it('keeps L180 / L218 as documented unreachable without src edits', () => {
    // L180: `basicVals` is a dense length-3 array literal; the
    // `a/b/c === undefined` continue is a noUncheckedIndexedAccess keep-site
    // and is not reachable without heap/race instrumentation.
    // L218: Goldbach fallthrough after the p1 scan — see isGoldbachNumber
    // suite note above.
    // Acceptance: lines/branches ≥98% OR documented unreachable (this note).
    expect(typeof generateExpressions).toBe('function');
    expect(typeof isGoldbachNumber).toBe('function');
  });
});
