/**
 * Wave 35 — renderExpressionBuilder result validity matrix.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import { renderExpressionBuilder } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function builderOf(
  parts: Array<
    | ReturnType<typeof createNumberCard>
    | ReturnType<typeof createOperatorCard>
    | null
  >,
  targetValue?: number
) {
  return {
    slots: parts.map((card, i) => createSlot(i, card ?? undefined)),
    targetValue,
  };
}

describe('Wave 35 expr-ui — builder result matrix', () => {
  it('matching target marks result valid', () => {
    const el = renderExpressionBuilder(
      builderOf(
        [
          createNumberCard(7, 'a'),
          createOperatorCard('+', 'p'),
          createNumberCard(3, 'b'),
        ],
        10
      ),
      { showResult: true }
    );
    const result = el.querySelector('.expression-result')!;
    expect(result.classList.contains('valid')).toBe(true);
    expect(result.textContent).toMatch(/10/);
    expect(result.textContent).toMatch(/[✓✔]/);
  });

  it('mismatching target stays neutral with target hint', () => {
    const el = renderExpressionBuilder(
      builderOf(
        [
          createNumberCard(1, 'a'),
          createOperatorCard('+', 'p'),
          createNumberCard(1, 'b'),
        ],
        10
      ),
      { showResult: true }
    );
    const result = el.querySelector('.expression-result')!;
    expect(result.classList.contains('neutral')).toBe(true);
    expect(result.textContent).toMatch(/target:\s*10/);
  });

  it('incomplete builder shows prompt without showResult false', () => {
    const el = renderExpressionBuilder(
      builderOf([createNumberCard(1, 'a'), null, null]),
      { showResult: true }
    );
    const result = el.querySelector('.expression-result')!;
    expect(
      result.classList.contains('neutral') ||
        result.classList.contains('invalid')
    ).toBe(true);
  });

  it('showResult omitted skips result node', () => {
    const el = renderExpressionBuilder(
      builderOf([
        createNumberCard(2, 'a'),
        createOperatorCard('+', 'p'),
        createNumberCard(2, 'b'),
      ])
    );
    expect(el.querySelector('.expression-result')).toBeNull();
    expect(el.querySelectorAll('.expression-slot')).toHaveLength(3);
  });

  it('onSlotClick fires for empty slot', () => {
    const ids: string[] = [];
    const el = renderExpressionBuilder(builderOf([null, null]), {
      onSlotClick: (s) => ids.push(s.id),
    });
    (el.querySelector('.expression-slot') as HTMLElement).click();
    expect(ids).toHaveLength(1);
  });
});
