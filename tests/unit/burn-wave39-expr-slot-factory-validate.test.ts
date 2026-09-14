/**
 * Wave 39 — createSlot / createParenCard / createOperatorCard → validateSlots.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createSlot,
  createParenCard,
  createOperatorCard,
  createNumberCard,
  validateSlots,
  slotsToExpression,
} from '../../src/core/expressions';

describe('Wave 39 expr — slot factory validate', () => {
  it('paren + number + op factory cards evaluate to 20', () => {
    const slots = [
      createSlot(0, createParenCard(true, 'lp')),
      createSlot(1, createNumberCard(2, 'n2')),
      createSlot(2, createOperatorCard('+', 'op+')),
      createSlot(3, createNumberCard(3, 'n3')),
      createSlot(4, createParenCard(false, 'rp')),
      createSlot(5, createOperatorCard('*', 'op*')),
      createSlot(6, createNumberCard(4, 'n4')),
    ];
    const validation = validateSlots(slots);
    expect(validation.canEvaluate).toBe(true);
    expect(validation.result).toBe(20);
    expect(slotsToExpression(slots)).toContain('2');
    expect(slotsToExpression(slots)).toContain('3');
    expect(slotsToExpression(slots)).toContain('4');
  });

  it('gap empty slot yields non-evaluable expression', () => {
    const slots = [
      createSlot(0, createNumberCard(5, 'n5')),
      createSlot(1), // empty
      createSlot(2, createNumberCard(1, 'n1')),
    ];
    const v = validateSlots(slots);
    expect(v.canEvaluate).toBe(false);
  });
});
