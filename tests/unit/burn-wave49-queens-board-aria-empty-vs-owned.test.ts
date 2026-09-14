/**
 * Wave 49 — Queens aria empty vs owned labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — aria empty/owned', () => {
  it('center empty and queen owned labels differ', () => {
    const svg = renderBoard(createInitialState(), () => {});
    const empty = svg.querySelector(`g[data-cell-key="${cellKey(0, 0)}"]`)?.getAttribute('aria-label') ?? '';
    const queen = svg.querySelector(`g[data-cell-key="${cellKey(5, 7)}"]`)?.getAttribute('aria-label') ?? '';
    expect(empty.toLowerCase()).toMatch(/empty|vacant|ring 0/);
    expect(queen).toMatch(/Blue|Queen/i);
  });
});
