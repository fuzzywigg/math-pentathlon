/**
 * Wave 49 leftover after #221/#226/#227 — Contig renderBoard cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — renderBoard cells', () => {
  it('renders GRID_ROWS * GRID_COLS cells', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.classList.contains('contig-board')).toBe(true);
    expect(el.querySelectorAll('.contig-cell').length).toBe(CONFIG.GRID_ROWS * CONFIG.GRID_COLS);
  });
});
