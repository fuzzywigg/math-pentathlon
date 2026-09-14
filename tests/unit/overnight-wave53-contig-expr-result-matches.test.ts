/**
 * Overnight HEAVY leftovers after #236 — Contig expr-result matches placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — expr result', () => {
  it('lists every valid result in .expr-result', () => {
    const state = {
      ...createInitialState(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    const results = getValidPlacements(state, state.currentDice!).map((p) => String(p.result));
    const el = renderExpressionSelector(state, () => undefined, () => undefined);
    const shown = [...el.querySelectorAll('.expr-result')].map((n) => n.textContent);
    expect(shown).toEqual(results);
  });
});
