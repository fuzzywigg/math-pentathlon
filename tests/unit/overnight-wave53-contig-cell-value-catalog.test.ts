/**
 * Overnight HEAVY leftovers after #236 — Contig cell values match BOARD_NUMBERS. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — cell values', () => {
  it('puts BOARD_NUMBERS into .contig-cell-value at matching coords', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const mid = BOARD_NUMBERS[2]![3]!;
    const cell = el.querySelector('.contig-cell[data-row="2"][data-col="3"]');
    expect(cell?.querySelector('.contig-cell-value')?.textContent).toBe(String(mid));
    expect(cell?.getAttribute('data-value')).toBe(String(mid));
  });
});
