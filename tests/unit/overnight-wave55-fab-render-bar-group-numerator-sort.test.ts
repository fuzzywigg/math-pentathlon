/**
 * Wave 55 leftover after #249/#250 — Fab bar group numerator sort. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 55 fab — bar group numerator sort', () => {
  it('wrappers within a denom group are ordered by numerator', () => {
    const state = createInitialState();
    const el = renderFractionBarPool(state, () => undefined);
    const groups = [...el.querySelectorAll('.fab-bar-group')];
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      const nums = [...group.querySelectorAll('[data-bar-id]')].map((wrap) => {
        const id = (wrap as HTMLElement).dataset.barId!;
        return state.fractionBars.get(id)!.fraction.numerator;
      });
      const denoms = [...group.querySelectorAll('[data-bar-id]')].map((wrap) => {
        const id = (wrap as HTMLElement).dataset.barId!;
        return state.fractionBars.get(id)!.fraction.denominator;
      });
      expect(new Set(denoms).size).toBe(1);
      const sorted = [...nums].sort((a, b) => a - b);
      expect(nums).toEqual(sorted);
    }
  });
});
