/**
 * Overnight HEAVY leftover after #241 — unclaimed value text fill #333. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — value text unclaimed', () => {
  it('prints island.value in dark fill', () => {
    const s = createInitialState();
    const island = s.islands[0]!;
    const svg = renderBoard(s, () => undefined, () => undefined);
    const texts = [...svg.querySelectorAll(`[data-island-id="${island.id}"] text`)];
    const value = texts.find((t) => t.textContent === String(island.value));
    expect(value?.getAttribute('fill')).toBe('#333');
  });
});
