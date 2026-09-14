/**
 * Wave 56 leftover after #243 — Contig column count residual.
 * Row count covered in wave53; per-row cols were not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 56 contig — col count', () => {
  it('renders CONFIG.GRID_COLS cells in every row', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const rows = el.querySelectorAll('.contig-row');
    expect(rows.length).toBe(CONFIG.GRID_ROWS);
    for (const row of rows) {
      expect(row.querySelectorAll('.contig-cell').length).toBe(CONFIG.GRID_COLS);
    }
  });
});
