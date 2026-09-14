/**
 * Overnight HEAVY leftover after #241 — player2 island seat fill. Tests-only.
 * Distinct from wave51 player1 owned fill.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';
import { getPlayerSeatColors } from '../../src/ui/player-colors';

describe('Wave 54 remainder — player2 fill', () => {
  it('fills player2-owned hex with seat color', () => {
    const base = createInitialState();
    const island = base.islands[2]!;
    const state = {
      ...base,
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player2' as const, chips: 1 } : i
      ),
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const hex = svg.querySelector(`[data-island-id="${island.id}"] polygon`);
    expect(hex?.getAttribute('fill')).toBe(getPlayerSeatColors().player2);
  });
});
