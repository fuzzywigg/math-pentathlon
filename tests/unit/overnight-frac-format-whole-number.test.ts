/**
 * Overnight TOKENMAXX HEAVY — frac-fact format whole number leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { formatFraction, getOperationSymbol } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — format + symbols', () => {
  it('denominator 1 formats as whole number', () => {
    expect(formatFraction({ numerator: 7, denominator: 1 })).toBe('7');
    expect(formatFraction({ numerator: 3, denominator: 4 })).toBe('3/4');
  });

  it('operation symbols cover four ops', () => {
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });
});
