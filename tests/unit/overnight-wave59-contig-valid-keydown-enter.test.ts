/**
 * Wave 59 Contig/SD residual — Contig valid cell Enter activate. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — valid Enter key', () => {
  it('Enter on valid cell invokes onCellClick', () => {
    const onClick = vi.fn();
    const el = renderBoard(
      {
        ...createInitialState(),
        phase: 'calculating',
        currentDice: [1, 2, 3],
      },
      onClick
    );
    const cell = el.querySelector('.contig-cell-valid') as HTMLElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(Number(cell.dataset.value));
  });
});
