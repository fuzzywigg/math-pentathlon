/**
 * Wave 49 — Queens selected aria includes selected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 49 queens — aria selected', () => {
  it('selected cell aria-label mentions selected', () => {
    const s = { ...createInitialState(), selectedPiece: cellKey(5, 7) };
    const svg = renderBoard(s, () => {});
    const g = svg.querySelector(`g[data-cell-key="${cellKey(5, 7)}"]`);
    expect(g?.getAttribute('aria-label')?.toLowerCase()).toContain('selected');
  });
});
