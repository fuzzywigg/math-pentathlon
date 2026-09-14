/**
 * Wave 44 overnight HEAVY — Fab calculateResult four-op matrix.
 */
import { describe, it, expect } from 'vitest';
import { calculateResult } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — calculateResult matrix', () => {
  const half = { numerator: 1, denominator: 2 };
  const third = { numerator: 1, denominator: 3 };

  it('add / multiply simplify', () => {
    const sum = calculateResult(half, half, 'add');
    expect(sum?.numerator).toBe(1);
    expect(sum?.denominator).toBe(1);
    const prod = calculateResult(half, half, 'multiply');
    expect(prod?.numerator).toBe(1);
    expect(prod?.denominator).toBe(4);
  });

  it('subtract / divide ordered', () => {
    const diff = calculateResult(half, third, 'subtract');
    expect(diff?.numerator).toBe(1);
    expect(diff?.denominator).toBe(6);
    const quot = calculateResult(half, half, 'divide');
    expect(quot?.numerator).toBe(1);
    expect(quot?.denominator).toBe(1);
  });

  it('divide-by-zero null and unknown op null', () => {
    expect(calculateResult(half, { numerator: 0, denominator: 1 }, 'divide')).toBeNull();
    expect(calculateResult(half, half, 'pow' as never)).toBeNull();
  });
});
