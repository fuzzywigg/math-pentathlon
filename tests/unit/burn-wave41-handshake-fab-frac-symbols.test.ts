/**
 * Wave 41 handshake — Fab-a-Diffy × Frac Fact operation symbols.
 * Game×game using real getOperationSymbol exports. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOperationSymbol as fabSymbol } from '../../src/games/fab-a-diffy/rules';
import { getOperationSymbol as fracSymbol } from '../../src/games/frac-fact/rules';
import type { FractionOperation } from '../../src/core/fractions/types';

const OPS: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

describe('Wave 41 handshake — fab × frac symbols', () => {
  it('fab and frac-fact symbols agree for every operation', () => {
    for (const op of OPS) {
      expect(fabSymbol(op)).toBe(fracSymbol(op));
    }
    expect(fabSymbol('add')).toBe('+');
    expect(fabSymbol('subtract')).toBe('−');
    expect(fabSymbol('multiply')).toBe('×');
    expect(fabSymbol('divide')).toBe('÷');
  });
});
