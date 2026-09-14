/**
 * Overnight HEAVY leftovers after #236 — Contig grid data-row/data-col. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — data-row/col', () => {
  it('stamps corners with data-row and data-col', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelector('.contig-cell[data-row="0"][data-col="0"]')).toBeTruthy();
    expect(
      el.querySelector(
        `.contig-cell[data-row="${CONFIG.GRID_ROWS - 1}"][data-col="${CONFIG.GRID_COLS - 1}"]`
      )
    ).toBeTruthy();
  });
});
