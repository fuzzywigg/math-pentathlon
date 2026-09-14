/**
 * Wave 49 — Queens queen cells render crown glyph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — queen crown', () => {
  it('p1 queen cell contains crown', () => {
    const svg = renderBoard(createInitialState(), () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(5, 7)}"]`);
    expect(g?.textContent).toContain('♛');
  });
});
