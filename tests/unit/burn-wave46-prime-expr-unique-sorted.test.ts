/**
 * Wave 46 — Prime Gold generateExpressions unique sorted leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { generateExpressions } from '../../src/games/prime-gold/types';

describe('Wave 46 prime — expr unique sorted', () => {
  it('values unique, sorted ascending, within 1..49', () => {
    const exprs = generateExpressions(3, 4, 5);
    const values = exprs.map((e) => e.value);
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(values.length);
    expect(values.every((v) => v >= 1 && v <= 49)).toBe(true);
  });
});
