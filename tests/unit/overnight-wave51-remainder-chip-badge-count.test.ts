/**
 * Overnight HEAVY leftovers after #234/#235 — Remainder chip badge count text. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 51 remainder — chip badge', () => {
  it('shows chip count text on owned island with chips>0', () => {
    const base = createInitialState();
    const island = base.islands[1]!;
    const state = {
      ...base,
      islands: base.islands.map((i) =>
        i.id === island.id
          ? { ...i, owner: 'player2' as const, chips: 3 }
          : i
      ),
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    const texts = [...g.querySelectorAll('text')].map((t) => t.textContent);
    expect(texts).toContain('3');
  });
});
