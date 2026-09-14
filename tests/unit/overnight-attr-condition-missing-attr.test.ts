/**
 * Overnight TOKENMAXX — evaluateCondition missing attribute leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluateCondition, matchesPiece } from '../../src/core/attributes/logic';
import type { AttributePiece } from '../../src/core/attributes/types';

describe('Overnight attr — missing attribute condition', () => {
  it('undefined attribute fails condition', () => {
    const piece: AttributePiece = { id: 'x', attributes: { color: 'red' } };
    expect(
      evaluateCondition(piece, { attribute: 'shape', operator: 'equals', value: 'circle' })
    ).toBe(false);
    expect(
      matchesPiece(piece, { attribute: 'color', operator: 'equals', value: 'red' })
    ).toBe(true);
  });
});
