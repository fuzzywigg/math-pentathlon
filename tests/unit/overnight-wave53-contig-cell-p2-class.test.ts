/**
 * Overnight HEAVY leftovers after #236 — Contig owned Red cell class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — p2 class', () => {
  it('adds contig-cell-p2 on a Red-owned board number', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[1]![1]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player2' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    expect(
      el.querySelector(`[data-value="${value}"]`)?.classList.contains('contig-cell-p2')
    ).toBe(true);
  });
});
