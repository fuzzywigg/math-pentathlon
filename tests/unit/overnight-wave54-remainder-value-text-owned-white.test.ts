/**
 * Overnight HEAVY leftover after #241 — owned value text fill white. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — value text owned', () => {
  it('owned island value text is white', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const state = {
      ...base,
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player1' as const, chips: 1 } : i
      ),
    };
    const svg = renderBoard(state, () => undefined, () => undefined);
    const texts = [...svg.querySelectorAll(`[data-island-id="${island.id}"] text`)];
    const value = texts.find((t) => t.textContent === String(island.value));
    expect(value?.getAttribute('fill')).toBe('white');
  });
});
