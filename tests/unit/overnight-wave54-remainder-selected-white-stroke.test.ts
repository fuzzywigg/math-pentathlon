/**
 * Overnight HEAVY leftover after #241 — selected hex overrides stroke to white w=5.
 * Distinct from wave51 selected class + valid yellow stroke.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — selected white stroke', () => {
  it('selected+valid uses white stroke-width 5 not yellow', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [island.id],
      selectedIsland: island.id,
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const hex = svg.querySelector(`[data-island-id="${island.id}"] polygon`);
    expect(hex?.getAttribute('stroke')).toBe('#fff');
    expect(hex?.getAttribute('stroke-width')).toBe('5');
  });
});
