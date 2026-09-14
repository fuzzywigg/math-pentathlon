/**
 * Overnight HEAVY leftovers after #236 — Contig owned Blue cell class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — p1 class', () => {
  it('adds contig-cell-p1 on a Blue-owned board number', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[0]![0]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player1' });
    const el = renderBoard({ ...base, cells }, () => undefined);
    expect(
      el.querySelector(`[data-value="${value}"]`)?.classList.contains('contig-cell-p1')
    ).toBe(true);
  });
});
