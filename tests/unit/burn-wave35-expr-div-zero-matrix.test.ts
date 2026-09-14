/**
 * Wave 35 — division-by-zero evaluate / slots leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  evaluate,
  validateSlots,
  createSlot,
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions';

describe('Wave 35 expr-div0 — evaluate errors', () => {
  it.each(['1/0', '5/(2-2)', '(3+1)/(0*9)', '0/0'])(
    'fails on %s',
    (expr) => {
      const result = evaluate(expr);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Division by zero/i);
    }
  );
});

describe('Wave 35 expr-div0 — slots canEvaluate false', () => {
  it('valid structure but eval fails → canEvaluate false', () => {
    const slots = [
      createSlot(0, createNumberCard(8)),
      createSlot(1, createOperatorCard('/')),
      createSlot(2, createNumberCard(0)),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors.some((e) => /Division by zero/i.test(e))).toBe(true);
  });
});
