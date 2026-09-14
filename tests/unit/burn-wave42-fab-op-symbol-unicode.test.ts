/**
 * Wave 42 — Fab-a-Diffy getOperationSymbol unicode matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getOperationSymbol } from '../../src/games/fab-a-diffy/rules';

describe('Wave 42 fab — op symbol unicode', () => {
  it('maps ops to unicode arithmetic glyphs', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('subtract/multiply/divide are not ascii lookalikes', () => {
    expect(getOperationSymbol('subtract')).not.toBe('-');
    expect(getOperationSymbol('multiply')).not.toBe('x');
    expect(getOperationSymbol('multiply')).not.toBe('*');
    expect(getOperationSymbol('divide')).not.toBe('/');
  });
});
