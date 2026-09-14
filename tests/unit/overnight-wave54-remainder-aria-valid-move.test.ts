/**
 * Overnight HEAVY leftover after #241 — valid island aria valid move + selected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — aria valid selected', () => {
  it('selected valid island announces valid move and selected', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 1, die2: 2, total: 3 },
      validIslands: [island.id],
      selectedIsland: island.id,
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const label = svg.querySelector(`[data-island-id="${island.id}"]`)?.getAttribute('aria-label') ?? '';
    expect(label).toContain('valid move');
    expect(label).toContain('selected');
  });
});
