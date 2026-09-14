/**
 * Wave 29 — attribute compare / compound evaluation edges.
 * Distinct from wave 21 smoke (happy-path operators once), #142 fractions/expr/timer/dice/graph,
 * #145 polyomino transform. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  compare,
  evaluateCondition,
  evaluateCompound,
  matchesPiece,
} from '../../src/core/attributes/logic';
import {
  createPiece,
  type ComparisonOperator,
  type CompoundCondition,
} from '../../src/core/attributes/types';

describe('Wave 29 attr-compare — equality / inequality matrix', () => {
  it('equals and not_equals across string / number / boolean', () => {
    expect(compare('red', 'equals', 'red')).toBe(true);
    expect(compare('red', 'equals', 'blue')).toBe(false);
    expect(compare(0, 'equals', 0)).toBe(true);
    expect(compare(true, 'equals', true)).toBe(true);
    expect(compare(true, 'equals', false)).toBe(false);
    expect(compare(1, 'equals', true)).toBe(false);

    expect(compare('a', 'not_equals', 'b')).toBe(true);
    expect(compare(3, 'not_equals', 3)).toBe(false);
    expect(compare(false, 'not_equals', true)).toBe(true);
  });

  it('numeric operators reject mixed types and cover equality boundaries', () => {
    const ops: ComparisonOperator[] = [
      'greater_than',
      'less_than',
      'greater_equal',
      'less_equal',
    ];
    for (const op of ops) {
      expect(compare('5', op, 3)).toBe(false);
      expect(compare(5, op, '3')).toBe(false);
      expect(compare(true, op, 1)).toBe(false);
    }

    expect(compare(5, 'greater_than', 5)).toBe(false);
    expect(compare(5, 'greater_equal', 5)).toBe(true);
    expect(compare(5, 'less_than', 5)).toBe(false);
    expect(compare(5, 'less_equal', 5)).toBe(true);
    expect(compare(-2, 'less_than', -1)).toBe(true);
    expect(compare(-1, 'greater_than', -3)).toBe(true);
  });

  it('unknown operator falls through to false', () => {
    expect(compare(1, 'bogus' as ComparisonOperator, 1)).toBe(false);
  });
});

describe('Wave 29 attr-compare — evaluateCondition edges', () => {
  const piece = createPiece('p', {
    color: 'red',
    size: 3,
    flagged: true,
  });

  it('missing attribute always fails regardless of operator', () => {
    for (const operator of [
      'equals',
      'not_equals',
      'greater_than',
      'less_than',
      'greater_equal',
      'less_equal',
    ] as ComparisonOperator[]) {
      expect(
        evaluateCondition(piece, {
          attribute: 'absent',
          operator,
          value: 0,
        })
      ).toBe(false);
    }
  });

  it('boolean and numeric conditions pass independently', () => {
    expect(
      evaluateCondition(piece, {
        attribute: 'flagged',
        operator: 'equals',
        value: true,
      })
    ).toBe(true);
    expect(
      evaluateCondition(piece, {
        attribute: 'size',
        operator: 'greater_equal',
        value: 3,
      })
    ).toBe(true);
    expect(
      evaluateCondition(piece, {
        attribute: 'size',
        operator: 'less_than',
        value: 3,
      })
    ).toBe(false);
  });
});

describe('Wave 29 attr-compare — nested compound depth', () => {
  const piece = createPiece('nest', {
    color: 'blue',
    size: 4,
    shape: 'circle',
  });

  it('and / or / xor / not cover empty and multi-branch cases', () => {
    expect(evaluateCompound(piece, { operator: 'and', conditions: [] })).toBe(
      true
    );
    expect(evaluateCompound(piece, { operator: 'or', conditions: [] })).toBe(
      false
    );
    expect(evaluateCompound(piece, { operator: 'xor', conditions: [] })).toBe(
      false
    );
    expect(evaluateCompound(piece, { operator: 'not', conditions: [] })).toBe(
      false
    );

    const bothTrue: CompoundCondition = {
      operator: 'xor',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'blue' },
        { attribute: 'shape', operator: 'equals', value: 'circle' },
      ],
    };
    expect(evaluateCompound(piece, bothTrue)).toBe(false);

    const oneTrue: CompoundCondition = {
      operator: 'xor',
      conditions: [
        { attribute: 'color', operator: 'equals', value: 'blue' },
        { attribute: 'size', operator: 'equals', value: 99 },
      ],
    };
    expect(evaluateCompound(piece, oneTrue)).toBe(true);
  });

  it('nested and-inside-or and not-of-and evaluate correctly', () => {
    const nested: CompoundCondition = {
      operator: 'or',
      conditions: [
        {
          operator: 'and',
          conditions: [
            { attribute: 'color', operator: 'equals', value: 'red' },
            { attribute: 'size', operator: 'equals', value: 4 },
          ],
        },
        {
          operator: 'and',
          conditions: [
            { attribute: 'shape', operator: 'equals', value: 'circle' },
            { attribute: 'size', operator: 'greater_than', value: 2 },
          ],
        },
      ],
    };
    expect(evaluateCompound(piece, nested)).toBe(true);

    const notAnd: CompoundCondition = {
      operator: 'not',
      conditions: [
        {
          operator: 'and',
          conditions: [
            { attribute: 'color', operator: 'equals', value: 'blue' },
            { attribute: 'size', operator: 'equals', value: 99 },
          ],
        },
      ],
    };
    expect(evaluateCompound(piece, notAnd)).toBe(true);
  });

  it('unknown compound operator returns false; matchesPiece dispatches', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'nand' as CompoundCondition['operator'],
        conditions: [{ attribute: 'color', operator: 'equals', value: 'blue' }],
      })
    ).toBe(false);

    expect(
      matchesPiece(piece, {
        attribute: 'color',
        operator: 'equals',
        value: 'blue',
      })
    ).toBe(true);
    expect(
      matchesPiece(piece, {
        operator: 'and',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'blue' },
          { attribute: 'size', operator: 'less_equal', value: 4 },
        ],
      })
    ).toBe(true);
  });
});
