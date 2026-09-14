/**
 * Overnight HEAVY leftovers after #236 — Contig ARIA grid leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — grid role', () => {
  it('marks the board as a grid of GRID_ROWS * GRID_COLS gridcells', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.getAttribute('role')).toBe('grid');
    expect(el.querySelectorAll('[role="gridcell"]').length).toBe(
      CONFIG.GRID_ROWS * CONFIG.GRID_COLS
    );
  });
});
