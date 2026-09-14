/**
 * Overnight HEAVY leftover after #241 — owned aria extras chips + Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — aria chips extra', () => {
  it('player2 owned chips announce Red and N chips', () => {
    const base = createInitialState();
    const island = base.islands[1]!;
    const state = {
      ...base,
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player2' as const, chips: 4 } : i
      ),
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const label = svg.querySelector(`[data-island-id="${island.id}"]`)?.getAttribute('aria-label') ?? '';
    expect(label).toContain('Red');
    expect(label).toContain('4 chips');
    expect(label).not.toContain('empty');
  });
});
