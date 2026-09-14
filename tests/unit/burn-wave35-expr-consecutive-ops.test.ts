/**
 * Wave 35 — validateSlots consecutive operators leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  createSlot,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

describe('Wave 35 expr-consec-ops — rejected pairs', () => {
  it.each([
    ['+', '+'],
    ['*', '/'],
    ['-', '*'],
    ['/', '+'],
  ] as const)('rejects %s then %s', (a, b) => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard(a)),
      createSlot(2, createOperatorCard(b)),
      createSlot(3, createNumberCard(2)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /Consecutive operators/i.test(e))).toBe(true);
  });
});

describe('Wave 35 expr-consec-ops — valid mix', () => {
  it('number op number op number ok', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(2)),
      createSlot(3, createOperatorCard('*')),
      createSlot(4, createNumberCard(3)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.result).toBe(7);
  });
});
