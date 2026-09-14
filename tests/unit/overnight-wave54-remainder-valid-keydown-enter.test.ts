/**
 * Overnight HEAVY leftover after #241 — Enter on valid group activates. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — keydown Enter', () => {
  it('Enter on valid group calls onIslandClick', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const onClick = vi.fn();
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 5, die2: 1, total: 6 },
      validIslands: [island.id],
    };
    const svg = renderBoard(state, onClick, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(island.id);
  });
});
