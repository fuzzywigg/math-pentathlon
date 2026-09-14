/**
 * Overnight HEAVY leftovers after #236 — Contig owned cells do not click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, BOARD_NUMBERS } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 53 contig — owned no-click', () => {
  it('does not fire onCellClick for a Blue-owned cell', () => {
    const base = createInitialState();
    const value = BOARD_NUMBERS[0]![0]!;
    const cells = new Map(base.cells);
    cells.set(value, { ...cells.get(value)!, owner: 'player1' });
    const onClick = vi.fn();
    const el = renderBoard(
      { ...base, cells, phase: 'calculating', currentDice: [1, 2, 3] },
      onClick
    );
    (el.querySelector(`[data-value="${value}"]`) as HTMLElement).click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
