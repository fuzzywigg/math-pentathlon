/**
 * Overnight TOKENMAXX — nested compound not/xor/and leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluateCompound, matchesPiece } from '../../src/core/attributes/logic';
import type { AttributePiece, CompoundCondition } from '../../src/core/attributes/types';

const piece: AttributePiece = {
  id: 'p1',
  attributes: { color: 'red', count: 2, filled: true },
};

describe('Overnight attr — compound nest', () => {
  it('and/or/xor/not nest correctly', () => {
    const andCond: CompoundCondition = {
      operator: 'and',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'red' },
        { attribute: 'count', operator: 'greater_equal', value: 2 },
      ],
    };
    expect(evaluateCompound(piece, andCond)).toBe(true);

    const xor: CompoundCondition = {
      operator: 'xor',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'red' },
        { attribute: 'count', operator: 'equals', value: 9 },
      ],
    };
    expect(evaluateCompound(piece, xor)).toBe(true);

    const notEmpty: CompoundCondition = { operator: 'not', conditions: [] };
    expect(evaluateCompound(piece, notEmpty)).toBe(false);

    const notMatch: CompoundCondition = {
      operator: 'not',
      conditions: [{ attribute: 'color', operator: 'equals', value: 'blue' }],
    };
    expect(matchesPiece(piece, notMatch)).toBe(true);
  });

  it('nested or inside and', () => {
    const nested: CompoundCondition = {
      operator: 'and',
      conditions: [
        {
          operator: 'or',
          conditions: [
            { attribute: 'color', operator: 'equals', value: 'blue' },
            { attribute: 'filled', operator: 'equals', value: true },
          ],
        },
        { attribute: 'count', operator: 'less_than', value: 5 },
      ],
    };
    expect(evaluateCompound(piece, nested)).toBe(true);
  });

  it('unknown compound op is false', () => {
    expect(
      evaluateCompound(piece, { operator: 'nand' as never, conditions: [] })
    ).toBe(false);
  });
});
