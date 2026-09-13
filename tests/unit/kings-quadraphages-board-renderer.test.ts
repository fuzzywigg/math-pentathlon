import { describe, it, expect, afterEach } from 'vitest';
import {
  createInitialBoard,
  BOARD_SIZE,
  PLAYER1_KING_START,
} from '../../src/games/kings-quadraphages/board';
import {
  renderBoard,
  updateBoard,
} from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('style[data-board-styles]')
    .forEach((el) => el.remove());
});

describe('Kings board-renderer (legacy DOM)', () => {
  it('renderBoard mounts a 9×9 grid of cells with starting kings', () => {
    const board = createInitialBoard();
    let clicked: { row: number; col: number } | null = null;
    const el = renderBoard(board, {
      onCellClick: (pos) => {
        clicked = pos;
      },
    });
    document.body.appendChild(el);

    expect(el.classList.contains('game-board')).toBe(true);
    expect(el.querySelectorAll('.cell')).toHaveLength(BOARD_SIZE * BOARD_SIZE);
    expect(el.querySelectorAll('.piece.king')).toHaveLength(2);
    expect(document.querySelector('style[data-board-styles]')).toBeTruthy();

    const cell = el.querySelector(
      `[data-row="${PLAYER1_KING_START.row}"][data-col="${PLAYER1_KING_START.col}"]`
    ) as HTMLElement;
    expect(cell).toBeTruthy();
    cell.click();
    expect(clicked).toEqual(PLAYER1_KING_START);
  });

  it('updateBoard refreshes cells without remounting styles', () => {
    const board = createInitialBoard();
    const el = renderBoard(board);
    document.body.appendChild(el);
    expect(document.querySelectorAll('style[data-board-styles]')).toHaveLength(
      1
    );

    board[4][4] = {
      type: 'quadraphage',
      owner: 'player1',
    };
    updateBoard(el, board);
    expect(el.querySelectorAll('.cell')).toHaveLength(BOARD_SIZE * BOARD_SIZE);
    const mid = el.querySelector('[data-row="4"][data-col="4"]');
    expect(mid?.querySelector('.piece.quadraphage')).toBeTruthy();
    expect(document.querySelectorAll('style[data-board-styles]')).toHaveLength(
      1
    );
  });
});
