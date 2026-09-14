/**
 * Wave 42 — Prime Gold generateExpressions leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { generateExpressions } from '../../src/games/prime-gold/types';

describe('Wave 42 prime — generateExpressions', () => {
  it('keeps all results in 1..49 as integers', () => {
    for (const triple of [
      [1, 1, 1],
      [2, 3, 4],
      [6, 6, 6],
      [3, 4, 5],
    ] as const) {
      const results = generateExpressions(...triple);
      expect(results.length).toBeGreaterThan(0);
      for (const { value } of results) {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(49);
        expect(Number.isInteger(value)).toBe(true);
      }
    }
  });

  it('includes sum and product paths for simple triples', () => {
    const results = generateExpressions(2, 3, 4);
    const values = new Set(results.map((r) => r.value));
    expect(values.has(2)).toBe(true);
    expect(values.has(3)).toBe(true);
    expect(values.has(4)).toBe(true);
    expect(values.has(9)).toBe(true); // 2+3+4
    expect(values.has(24)).toBe(true); // 2×3×4
  });

  it('includes factorial paths when dice values permit', () => {
    const results = generateExpressions(3, 2, 1);
    const values = new Set(results.map((r) => r.value));
    expect(values.has(6)).toBe(true); // 3!
    expect(values.has(2)).toBe(true); // 2!
    const factorialExpr = results.find((r) => r.expr.includes('!'));
    expect(factorialExpr).toBeTruthy();
  });

  it('dedupes by value — one entry per reachable board number', () => {
    const results = generateExpressions(1, 2, 3);
    const values = results.map((r) => r.value);
    expect(values.length).toBe(new Set(values).size);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it('omits factorials and powers that exceed 49', () => {
    const results = generateExpressions(5, 5, 5);
    for (const { value } of results) {
      expect(value).toBeLessThanOrEqual(49);
    }
    expect(results.some((r) => r.value === 120)).toBe(false);
  });
});
