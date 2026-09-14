/**
 * Wave 56 leftover after #256 — Juggle occupied placing cell ignores click.
 * Distinct from wave55 empty placing click/Enter. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { createBoard } from '../../src/core/polyomino/placement';
import { CONFIG } from '../../src/games/juggle/types';
import { renderBoard } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — occupied placing no click', () => {
  it('occupied cells stay non-pointer and do not fire onCellClick', () => {
    const board = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    board.cells[0][0] = true;
    const placing = selectDie(
      {
        ...createInitialState(),
        boards: { player1: board, player2: createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE) },
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const onClick = vi.fn();
    const el = renderBoard(
      board,
      'player1',
      true,
      placing,
      onClick,
      () => undefined,
      () => undefined
    );
    const occupied = el.querySelector(
      '.juggle-cell.occupied-player1[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    expect(occupied.style.cursor).not.toBe('pointer');
    occupied.click();
    occupied.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
