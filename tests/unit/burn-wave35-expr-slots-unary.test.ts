/**
 * Wave 35 — validateSlots leading unary minus leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  createSlot,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

describe('Wave 35 expr-slots-unary — leading minus allowed', () => {
  it('accepts -N as starting operator minus', () => {
    const slots = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(5)),
    ];
    const v = validateSlots(slots);
    // leading '-' is explicitly allowed; evaluate('- 5') should work
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(-5);
  });

  it('rejects leading + / * / /', () => {
    for (const op of ['+', '*', '/'] as const) {
      const slots = [
        createSlot(0, createOperatorCard(op)),
        createSlot(1, createNumberCard(2)),
      ];
      const v = validateSlots(slots);
      expect(v.isValid).toBe(false);
      expect(v.errors.some((e) => /cannot start with an operator/i.test(e))).toBe(
        true
      );
    }
  });

  it('rejects trailing operator', () => {
    const slots = [
      createSlot(0, createNumberCard(3)),
      createSlot(1, createOperatorCard('+')),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /cannot end with an operator/i.test(e))).toBe(
      true
    );
  });
});
