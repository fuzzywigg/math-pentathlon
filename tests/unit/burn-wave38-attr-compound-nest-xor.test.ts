/**
 * Wave 38 — nested compound AND/OR/XOR/NOT evaluation lattice.
 * Beyond wave 29 shallow compounds. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluateCompound, matchesPiece } from '../../src/core/attributes/logic';
import {
  createPiece,
  type CompoundCondition,
  type AttributeCondition,
} from '../../src/core/attributes/types';

const piece = createPiece('x', { n: 4, color: 'blue', flag: false });

const eq = (attr: string, value: string | number | boolean): AttributeCondition => ({
  attribute: attr,
  operator: 'equals',
  value,
});

describe('Wave 38 attr-compound — XOR truth table', () => {
  it('xor is exactly-one of two leaf conditions', () => {
    const cases: Array<[CompoundCondition, boolean]> = [
      {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'blue')],
      } as CompoundCondition,
      {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'red')],
      } as CompoundCondition,
      {
        operator: 'xor',
        conditions: [eq('n', 9), eq('color', 'red')],
      } as CompoundCondition,
      {
        operator: 'xor',
        conditions: [eq('n', 9), eq('color', 'blue')],
      } as CompoundCondition,
    ];
    // fix typing - rebuild properly
    void cases;
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'blue')],
      })
    ).toBe(false); // both true
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'red')],
      })
    ).toBe(true);
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 9), eq('color', 'red')],
      })
    ).toBe(false);
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 9), eq('color', 'blue')],
      })
    ).toBe(true);
  });

  it('xor with three children counts exactly one true', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'red'), eq('flag', true)],
      })
    ).toBe(true);
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [eq('n', 4), eq('color', 'blue'), eq('flag', false)],
      })
    ).toBe(false); // two true (n and flag)
  });
});

describe('Wave 38 attr-compound — nested NOT / AND / OR', () => {
  it('not wraps a nested and', () => {
    const nested: CompoundCondition = {
      operator: 'not',
      conditions: [
        {
          operator: 'and',
          conditions: [eq('n', 4), eq('color', 'blue')],
        },
      ],
    };
    expect(evaluateCompound(piece, nested)).toBe(false);
    const flipped: CompoundCondition = {
      operator: 'not',
      conditions: [
        {
          operator: 'and',
          conditions: [eq('n', 4), eq('color', 'red')],
        },
      ],
    };
    expect(evaluateCompound(piece, flipped)).toBe(true);
  });

  it('not with empty children is false; unknown op false', () => {
    expect(
      evaluateCompound(piece, { operator: 'not', conditions: [] })
    ).toBe(false);
    expect(
      evaluateCompound(piece, {
        operator: 'nand' as CompoundCondition['operator'],
        conditions: [eq('n', 4)],
      })
    ).toBe(false);
  });

  it('deep or(and, xor) agrees with matchesPiece', () => {
    const deep: CompoundCondition = {
      operator: 'or',
      conditions: [
        {
          operator: 'and',
          conditions: [eq('n', 99), eq('color', 'blue')],
        },
        {
          operator: 'xor',
          conditions: [eq('flag', false), eq('n', 99)],
        },
      ],
    };
    expect(matchesPiece(piece, deep)).toBe(true);
  });
});
