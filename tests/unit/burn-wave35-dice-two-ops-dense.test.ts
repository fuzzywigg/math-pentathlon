/**
 * Wave 35 — dense getTwoDiceResults grid (1..12) division leftovers.
 * Distinct from wave32 sample pairs. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getTwoDiceResults } from '../../src/core/dice';

describe('Wave 35 dice-two-ops-dense — full small grid', () => {
  it('for a,b in 1..12: map keys match arithmetic rules', () => {
    for (let a = 1; a <= 12; a++) {
      for (let b = 1; b <= 12; b++) {
        const map = getTwoDiceResults(a, b);
        expect(map.size).toBeGreaterThanOrEqual(4);
        expect(map.get(`${a} + ${b}`)).toBe(a + b);
        expect(map.get(`${a} - ${b}`)).toBe(a - b);
        expect(map.get(`${b} - ${a}`)).toBe(b - a);
        expect(map.get(`${a} × ${b}`)).toBe(a * b);
        if (a % b === 0) {
          expect(map.get(`${a} ÷ ${b}`)).toBe(a / b);
        } else {
          expect(map.has(`${a} ÷ ${b}`)).toBe(false);
        }
        if (b % a === 0) {
          expect(map.get(`${b} ÷ ${a}`)).toBe(b / a);
        } else {
          expect(map.has(`${b} ÷ ${a}`)).toBe(false);
        }
      }
    }
  });
});

describe('Wave 35 dice-two-ops-dense — key uniqueness', () => {
  it('no duplicate keys within a map', () => {
    for (const [a, b] of [
      [6, 3],
      [9, 6],
      [8, 4],
      [11, 5],
    ] as const) {
      const map = getTwoDiceResults(a, b);
      expect(new Set(map.keys()).size).toBe(map.size);
    }
  });
});
