/**
 * Wave 35 — slotsToExpression / validateSlots gap & empty leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  slotsToExpression,
  validateSlots,
  createSlot,
  createNumberCard,
  createOperatorCard,
  createParenCard,
} from '../../src/core/expressions';

describe('Wave 35 expr-slots-gaps — empty and sparse', () => {
  it('joins only filled cards with spaces', () => {
    const slots = [
      createSlot(0, createNumberCard(3)),
      createSlot(1, null),
      createSlot(2, createOperatorCard('+')),
      createSlot(3, createNumberCard(4)),
    ];
    expect(slotsToExpression(slots)).toBe('3 + 4');
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(7);
  });

  it('all-null slots → No cards placed', () => {
    const slots = [createSlot(0), createSlot(1), createSlot(2)];
    expect(validateSlots(slots)).toEqual({
      isValid: false,
      canEvaluate: false,
      errors: ['No cards placed'],
    });
  });
});

describe('Wave 35 expr-slots-gaps — paren depth edges', () => {
  it('extra closing paren reported', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(2)),
      createSlot(3, createParenCard(false)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /Unmatched closing/i.test(e))).toBe(true);
  });

  it('open paren without close reported', () => {
    const slots = [
      createSlot(0, createParenCard(true)),
      createSlot(1, createNumberCard(5)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /Unmatched parentheses/i.test(e))).toBe(true);
  });
});
