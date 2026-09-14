/**
 * Overnight HEAVY leftovers after #234 — Remainder owned island seat fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';
import { getPlayerSeatColors } from '../../src/ui/player-colors';

describe('Wave 51 remainder — owned island fill', () => {
  it('fills owned island polygon with player1 seat color', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player1' as const, chips: 1 } : i
      ),
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    const hex = g.querySelector('polygon')!;
    expect(hex.getAttribute('fill')).toBe(getPlayerSeatColors().player1);
    expect(g.querySelector('circle')).toBeTruthy(); // chip badge
  });
});
