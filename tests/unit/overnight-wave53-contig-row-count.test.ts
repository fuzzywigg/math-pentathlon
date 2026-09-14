/**
 * Overnight HEAVY leftovers after #236 — Contig row count leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — rows', () => {
  it('renders CONFIG.GRID_ROWS contig-row shells', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.contig-row').length).toBe(CONFIG.GRID_ROWS);
  });
});
