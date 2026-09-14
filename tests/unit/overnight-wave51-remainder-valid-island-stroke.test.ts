/**
 * Overnight HEAVY leftovers after #234/#235 — Remainder valid-island stroke.
 * Tip skipped remainder board-ui deepen. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 51 remainder — valid stroke', () => {
  it('marks .valid and yellow stroke on validIslands', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [island.id],
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    expect(g.classList.contains('valid')).toBe(true);
    const hex = g.querySelector('polygon')!;
    expect(hex.getAttribute('stroke')).toBe('#ffeb3b');
    expect(hex.getAttribute('stroke-width')).toBe('4');
  });
});
