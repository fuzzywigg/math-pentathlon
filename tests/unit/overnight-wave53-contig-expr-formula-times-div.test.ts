/**
 * Overnight HEAVY leftovers after #236 — Contig formula ×/÷ leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — expr formula unicode', () => {
  it('replaces * and / with × and ÷ in .expr-formula', () => {
    const state = {
      ...createInitialState(),
      currentDice: [2, 2, 4] as [number, number, number],
      phase: 'calculating' as const,
    };
    const raw = getValidPlacements(state, state.currentDice!);
    expect(raw.some((p) => p.expression.includes('*') || p.expression.includes('/'))).toBe(
      true
    );
    const el = renderExpressionSelector(state, () => undefined, () => undefined);
    const formulas = [...el.querySelectorAll('.expr-formula')].map((n) => n.textContent ?? '');
    expect(formulas.some((f) => f.includes('×') || f.includes('÷'))).toBe(true);
    expect(formulas.every((f) => !f.includes('*') && !f.includes('/'))).toBe(true);
  });
});
