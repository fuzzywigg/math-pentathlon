/**
 * Wave 39 — evaluateCompound nested + empty not leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { evaluateCompound } from '../../src/core/attributes';
import type { AttributePiece, CompoundCondition } from '../../src/core/attributes';

describe('Wave 39 attr — compound nest / empty not', () => {
  const piece: AttributePiece = {
    id: 'p',
    attributes: { a: 1, b: 2, c: 'ok' },
  };

  it('empty not returns false', () => {
    const compound: CompoundCondition = { operator: 'not', conditions: [] };
    expect(evaluateCompound(piece, compound)).toBe(false);
  });

  it('not inverts single true condition', () => {
    const compound: CompoundCondition = {
      operator: 'not',
      conditions: [{ attribute: 'a', operator: 'equals', value: 1 }],
    };
    expect(evaluateCompound(piece, compound)).toBe(false);
  });

  it('nested and/or works', () => {
    const compound: CompoundCondition = {
      operator: 'and',
      conditions: [
        { attribute: 'a', operator: 'equals', value: 1 },
        {
          operator: 'or',
          conditions: [
            { attribute: 'b', operator: 'equals', value: 99 },
            { attribute: 'c', operator: 'equals', value: 'ok' },
          ],
        },
      ],
    };
    expect(evaluateCompound(piece, compound)).toBe(true);
  });

  it('xor true when exactly one matches', () => {
    const compound: CompoundCondition = {
      operator: 'xor',
      conditions: [
        { attribute: 'a', operator: 'equals', value: 1 },
        { attribute: 'b', operator: 'equals', value: 99 },
      ],
    };
    expect(evaluateCompound(piece, compound)).toBe(true);
  });

  it('unknown compound operator returns false', () => {
    const compound = {
      operator: 'nand',
      conditions: [{ attribute: 'a', operator: 'equals', value: 1 }],
    } as unknown as CompoundCondition;
    expect(evaluateCompound(piece, compound)).toBe(false);
  });
});
