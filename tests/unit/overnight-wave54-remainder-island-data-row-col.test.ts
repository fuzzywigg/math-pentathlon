/**
 * Overnight HEAVY leftover after #241 — island data-row/data-col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — data-row-col', () => {
  it('stamps dataset coords from island', () => {
    const s = createInitialState();
    const island = s.islands[4]!;
    const svg = renderBoard(s, () => undefined, () => undefined);
    const g = svg.querySelector(`[data-island-id="${island.id}"]`)!;
    expect(g.getAttribute('data-row')).toBe(String(island.row));
    expect(g.getAttribute('data-col')).toBe(String(island.col));
  });
});
