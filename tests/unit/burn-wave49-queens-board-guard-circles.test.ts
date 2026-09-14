/**
 * Wave 49 — Queens guard cells are circles without crown. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — guard glyph', () => {
  it('guard cell has circle and no crown', () => {
    const svg = renderBoard(createInitialState(), () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(5, 1)}"]`);
    expect(g?.querySelectorAll('circle').length).toBeGreaterThan(0);
    expect(g?.textContent).not.toContain('♛');
  });
});
