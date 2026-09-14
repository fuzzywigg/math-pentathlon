/**
 * Wave 35 — paren-aware builder validity / invalid operator edges.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { renderExpressionBuilder } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createSlot,
} from '../../src/core/expressions/types';
import { validateSlots } from '../../src/core/expressions/evaluator';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 expr-ui — paren builder', () => {
  it('renders (2+3)*4 valid against target 20', () => {
    const slots = [
      createSlot(0, createParenCard(true, 'lp')),
      createSlot(1, createNumberCard(2, 'n2')),
      createSlot(2, createOperatorCard('+', 'p')),
      createSlot(3, createNumberCard(3, 'n3')),
      createSlot(4, createParenCard(false, 'rp')),
      createSlot(5, createOperatorCard('*', 'm')),
      createSlot(6, createNumberCard(4, 'n4')),
    ];
    const validation = validateSlots(slots);
    expect(validation.canEvaluate).toBe(true);
    expect(validation.result).toBe(20);
    const el = renderExpressionBuilder(
      { slots, targetValue: 20 },
      { showResult: true }
    );
    expect(el.querySelectorAll('.expression-slot')).toHaveLength(7);
    expect(el.querySelector('.expression-result.valid')).toBeTruthy();
    expect(el.querySelector('.expression-result')?.textContent).toMatch(/20/);
  });

  it('double operator marks invalid result chrome', () => {
    const slots = [
      createSlot(0, createNumberCard(1, 'a')),
      createSlot(1, createOperatorCard('+', 'p1')),
      createSlot(2, createOperatorCard('+', 'p2')),
      createSlot(3, createNumberCard(2, 'b')),
    ];
    expect(validateSlots(slots).isValid).toBe(false);
    const el = renderExpressionBuilder({ slots }, { showResult: true });
    expect(el.querySelector('.expression-result.invalid')).toBeTruthy();
  });
});
