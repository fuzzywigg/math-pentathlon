/**
 * Wave 34 — renderExpressionBuilder result-state leftovers after #158.
 * Covers empty/neutral, miss-target, invalid, and no-showResult paths.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import {
  createNumberCard,
  createOperatorCard,
  createSlot,
  renderExpressionBuilder,
} from '../../src/core/expressions';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 34 expr-ui-builder — result state matrix', () => {
  it('empty slots with showResult surface No cards placed invalid chrome', () => {
    const el = renderExpressionBuilder(
      { slots: [createSlot(0), createSlot(1), createSlot(2)] },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.textContent).toMatch(/No cards placed/i);
  });

  it('trailing operator is valid=false invalid result (partial build)', () => {
    const el = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createNumberCard(8, 'n8')),
          createSlot(1, createOperatorCard('+', 'op')),
        ],
      },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.textContent).toMatch(/end with an operator|Invalid/i);
  });

  it('evaluable miss-target shows target hint without valid class', () => {
    const el = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createNumberCard(2, 'a')),
          createSlot(1, createOperatorCard('+', 'p')),
          createSlot(2, createNumberCard(3, 'b')),
        ],
        targetValue: 99,
      },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('valid')).toBe(false);
    expect(result?.classList.contains('neutral')).toBe(true);
    expect(result?.textContent).toMatch(/target:\s*99/i);
  });

  it('operator-only slots surface invalid result chrome', () => {
    const el = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createOperatorCard('+', 'op1')),
          createSlot(1, createOperatorCard('*', 'op2')),
        ],
      },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('invalid')).toBe(true);
    expect((result?.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('showResult omitted skips result element entirely', () => {
    const el = renderExpressionBuilder({
      slots: [
        createSlot(0, createNumberCard(1, 'n')),
        createSlot(1, createOperatorCard('+', 'o')),
        createSlot(2, createNumberCard(1, 'm')),
      ],
      targetValue: 2,
    });
    expect(el.querySelector('.expression-result')).toBeNull();
    expect(el.querySelectorAll('.expression-slot')).toHaveLength(3);
  });

  it('exact target match appends checkmark chrome', () => {
    const el = renderExpressionBuilder(
      {
        slots: [
          createSlot(0, createNumberCard(4, 'a')),
          createSlot(1, createOperatorCard('*', 'x')),
          createSlot(2, createNumberCard(5, 'b')),
        ],
        targetValue: 20,
      },
      { showResult: true }
    );
    const result = el.querySelector('.expression-result');
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.textContent).toMatch(/✓|20/);
  });
});
