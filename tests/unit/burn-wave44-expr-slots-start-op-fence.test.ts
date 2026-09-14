/**
 * Wave 44 — validateSlots start/end operator fence leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  validateSlots,
  createSlot,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

describe('Wave 44 expr — slots start/end op fence', () => {
  it('rejects leading non-minus operator', () => {
    const slots = [
      createSlot(0, createOperatorCard('+')),
      createSlot(1, createNumberCard(3)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /start/i.test(e))).toBe(true);
  });

  it('rejects trailing operator', () => {
    const slots = [
      createSlot(0, createNumberCard(3)),
      createSlot(1, createOperatorCard('*')),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(false);
    expect(v.errors.some((e) => /end/i.test(e))).toBe(true);
  });

  it('allows leading unary minus as operator card', () => {
    const slots = [
      createSlot(0, createOperatorCard('-')),
      createSlot(1, createNumberCard(4)),
    ];
    const v = validateSlots(slots);
    // consecutive? first is operator lastWasOperator true then number — should pass fence
    expect(v.errors.some((e) => /start/i.test(e))).toBe(false);
  });
});
