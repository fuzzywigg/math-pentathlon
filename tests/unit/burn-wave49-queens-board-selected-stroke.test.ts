/**
 * Wave 49 — Queens selected piece stroke width 3. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — selected stroke', () => {
  it('selected cell stroke-width is 3', () => {
    const s = { ...createInitialState(), selectedPiece: cellKey(5, 7) };
    const svg = renderBoard(s, () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(5, 7)}"]`);
    expect(g?.querySelector('path')?.getAttribute('stroke-width')).toBe('3');
    expect(g?.querySelector('path')?.getAttribute('stroke')).toBe('#ff9800');
  });
});
