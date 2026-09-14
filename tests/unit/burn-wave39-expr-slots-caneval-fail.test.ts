/**
 * Wave 39 — validateSlots canEvaluate fail on div-by-zero after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  validateSlots,
  slotsToExpression,
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions';

describe('Wave 39 expr-slots — canEvaluate fail', () => {
  it('syntactically valid 1/0 is valid but cannot evaluate', () => {
    const slots = [
      createSlot(0, createNumberCard(1)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(0)),
    ];
    expect(slotsToExpression(slots)).toBe('1 / 0');
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors.join(' ').toLowerCase()).toMatch(/divis/);
  });

  it('valid 2+3 can evaluate to 5', () => {
    const slots = [
      createSlot(0, createNumberCard(2)),
      createSlot(1, createOperatorCard('+')),
      createSlot(2, createNumberCard(3)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(true);
    expect(v.result).toBe(5);
  });
});
