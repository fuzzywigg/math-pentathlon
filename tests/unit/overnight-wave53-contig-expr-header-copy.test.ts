/**
 * Overnight HEAVY leftovers after #236 — Contig expression header copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — expr header', () => {
  it('shows Choose a number to place when placements exist', () => {
    const state = {
      ...createInitialState(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    expect(getValidPlacements(state, state.currentDice!).length).toBeGreaterThan(0);
    const el = renderExpressionSelector(state, () => undefined, () => undefined);
    expect(el.querySelector('.contig-expr-header')?.textContent).toBe(
      'Choose a number to place:'
    );
  });
});
