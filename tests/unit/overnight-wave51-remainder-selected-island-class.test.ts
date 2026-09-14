/**
 * Overnight HEAVY leftovers after #234 — Remainder selected island class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 51 remainder — selected island', () => {
  it('adds selected class on selectedIsland group', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 4, total: 7 },
      selectedIsland: island.id,
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    expect(g.classList.contains('selected')).toBe(true);
  });
});
