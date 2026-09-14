/**
 * Wave 38 — validateSlots / slotsToExpression empty leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  slotsToExpression,
  type ExpressionSlot,
} from '../../src/core/expressions';

function slot(
  id: string,
  card: ExpressionSlot['card']
): ExpressionSlot {
  return { id, card };
}

describe('Wave 38 expr-slots — empty validate', () => {
  it('all-null slots produce empty expression and invalid validation', () => {
    const slots = [slot('a', null), slot('b', null)];
    expect(slotsToExpression(slots)).toBe('');
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
  });

  it('filters blank content cards from expression string', () => {
    const slots = [
      slot('a', {
        id: 'c1',
        content: '2',
        tokenType: 'number',
        value: 2,
      }),
      slot('b', {
        id: 'c2',
        content: '',
        tokenType: 'number',
        value: 0,
      }),
      slot('c', {
        id: 'c3',
        content: '+',
        tokenType: 'operator',
        operator: '+',
      }),
      slot('d', {
        id: 'c4',
        content: '3',
        tokenType: 'number',
        value: 3,
      }),
    ];
    expect(slotsToExpression(slots)).toBe('2 + 3');
  });
});
