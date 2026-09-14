/**
 * Wave 39 — attributes nested evaluateCompound xor/not/and leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { evaluateCompound } from '../../src/core/attributes';

describe('Wave 39 attributes — nested compound', () => {
  const piece = {
    id: 'p1',
    attributes: { color: 'red', shape: 'circle', count: 2 },
  };

  it('and / or basics', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'and',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'red' },
          { attribute: 'shape', operator: 'equals', value: 'circle' },
        ],
      })
    ).toBe(true);
    expect(
      evaluateCompound(piece, {
        operator: 'or',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'blue' },
          { attribute: 'count', operator: 'equals', value: 2 },
        ],
      })
    ).toBe(true);
  });

  it('not inverts first condition', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'not',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'blue' },
        ],
      })
    ).toBe(true);
    expect(
      evaluateCompound(piece, {
        operator: 'not',
        conditions: [],
      })
    ).toBe(false);
  });

  it('xor requires exactly one true', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'red' },
          { attribute: 'shape', operator: 'equals', value: 'square' },
        ],
      })
    ).toBe(true);
    expect(
      evaluateCompound(piece, {
        operator: 'xor',
        conditions: [
          { attribute: 'color', operator: 'equals', value: 'red' },
          { attribute: 'shape', operator: 'equals', value: 'circle' },
        ],
      })
    ).toBe(false);
  });

  it('nested compound and(xor, equals)', () => {
    expect(
      evaluateCompound(piece, {
        operator: 'and',
        conditions: [
          {
            operator: 'xor',
            conditions: [
              { attribute: 'color', operator: 'equals', value: 'red' },
              { attribute: 'shape', operator: 'equals', value: 'square' },
            ],
          },
          { attribute: 'count', operator: 'greater_equal', value: 2 },
        ],
      })
    ).toBe(true);
  });
});
