/**
 * Wave 40 — Handshake fab ↔ frac-fact getOperationSymbol / calculateResult ops.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  getOperationSymbol as fabSymbol,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import { getOperationSymbol as fracFactSymbol } from '../../src/games/frac-fact/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

const OPS: FractionOperation[] = [
  'add',
  'subtract',
  'multiply',
  'divide',
];

describe('Wave 40 handshake — fab ↔ frac-fact ops/symbols', () => {
  it('getOperationSymbol aligns for the shared FractionOperation set', () => {
    for (const op of OPS) {
      expect(fabSymbol(op)).toBe(fracFactSymbol(op));
    }
    expect(fabSymbol('add')).toBe('+');
    expect(fabSymbol('subtract')).toBe('−');
    expect(fabSymbol('multiply')).toBe('×');
    expect(fabSymbol('divide')).toBe('÷');
  });

  it('calculateResult covers same four ops without null for nonzero divide', () => {
    const a = { numerator: 1, denominator: 2 };
    const b = { numerator: 1, denominator: 3 };
    for (const op of OPS) {
      const result = calculateResult(a, b, op);
      expect(result).not.toBeNull();
      expect(result!.denominator).toBeGreaterThan(0);
    }
    expect(calculateResult(a, { numerator: 0, denominator: 1 }, 'divide')).toBeNull();
  });
});
