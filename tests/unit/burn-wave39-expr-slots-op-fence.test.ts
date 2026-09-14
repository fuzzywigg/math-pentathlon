/**
 * Wave 39 — validateSlots operator fence leftovers after #172/#173.
 * Beyond wave38 empty slots. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions';

describe('Wave 39 expr-slots — op fence', () => {
  it('leading + / * fails; leading - allowed', () => {
    for (const op of ['+', '*', '/'] as const) {
      const slots = [
        createSlot(0, createOperatorCard(op)),
        createSlot(1, createNumberCard(3)),
      ];
      const v = validateSlots(slots);
      expect(v.isValid).toBe(false);
      expect(v.errors.some((e) => e.includes('start'))).toBe(true);
    }
    const unary = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(3)),
    ];
    const v = validateSlots(unary);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(-3);
  });

  it('trailing operator fails', () => {
    const slots = [
      createSlot(0, createNumberCard(4)),
      createSlot(1, createOperatorCard('+')),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => e.includes('end'))).toBe(true);
  });

  it('consecutive operators fail', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createOperatorCard('*')),
      createSlot(3, createNumberCard(2)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => e.toLowerCase().includes('consecutive'))).toBe(
      true
    );
  });
});
