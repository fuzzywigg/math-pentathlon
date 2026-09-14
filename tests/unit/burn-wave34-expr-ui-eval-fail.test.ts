/**
 * Wave 34 — expression validateSlots evaluation-failure builder chrome.
 * Hits isValid=true / canEvaluate=false result branch (div by zero).
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  renderExpressionBuilder,
  validateSlots,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 34 expr-ui-builder — eval failure chrome', () => {
  it('division by zero validates as isValid with canEvaluate false', () => {
    const slots = [
      createSlot(0, createNumberCard(5, 'n5')),
      createSlot(1, createOperatorCard('/', 'div')),
      createSlot(2, createNumberCard(0, 'n0')),
    ];
    const v = validateSlots(slots);
    expect(v.isValid).toBe(true);
    expect(v.canEvaluate).toBe(false);
    expect(v.errors.length).toBeGreaterThan(0);

    const el = renderExpressionBuilder({ slots }, { showResult: true });
    const result = el.querySelector('.expression-result');
    // errors.length > 0 → invalid chrome branch
    expect(result?.classList.contains('invalid')).toBe(true);
    expect((result?.textContent ?? '').length).toBeGreaterThan(0);
  });
});
