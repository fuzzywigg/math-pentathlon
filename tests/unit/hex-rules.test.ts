import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  HexBoard,
  Player,
} from '../../src/games/hex/types';
import {
  isValidMove,
  makeMove,
  checkWinner,
  getValidMoves,
  getWinningPath,
} from '../../src/games/hex/rules';

function boardWith(
  size: number,
  cells: Array<{ row: number; col: number; player: Player }>
): HexBoard {
  const board: HexBoard = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  for (const cell of cells) {
    board[cell.row][cell.col] = cell.player;
  }
  return board;
}

describe('Hex – move validation', () => {
  it('allows empty in-bounds cells on a fresh board', () => {
    const state = createInitialState(5);
    expect(isValidMove(state, { row: 2, col: 2 })).toBe(true);
    expect(isValidMove(state, { row: -1, col: 0 })).toBe(false);
    expect(isValidMove(state, { row: 5, col: 0 })).toBe(false);
  });

  it('rejects occupied cells and post-win moves', () => {
    let state = createInitialState(3);
    state = makeMove(state, { row: 1, col: 1 });
    expect(isValidMove(state, { row: 1, col: 1 })).toBe(false);

    const won = {
      ...createInitialState(3),
      winner: 'player1' as const,
    };
    expect(isValidMove(won, { row: 0, col: 0 })).toBe(false);
  });
});

describe('Hex – makeMove', () => {
  it('places a stone and flips the current player', () => {
    const state = createInitialState(5);
    const next = makeMove(state, { row: 2, col: 2 });

    expect(next).not.toBe(state);
    expect(next.board[2][2]).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
  });

  it('returns the same reference for illegal occupied clicks', () => {
    let state = createInitialState(3);
    state = makeMove(state, { row: 0, col: 0 });
    const illegal = makeMove(state, { row: 0, col: 0 });
    expect(illegal).toBe(state);
  });
});

describe('Hex – win paths', () => {
  it('detects player1 top-to-bottom win on a 3×3 board', () => {
    const board = boardWith(3, [
      { row: 0, col: 1, player: 'player1' },
      { row: 1, col: 1, player: 'player1' },
      { row: 2, col: 1, player: 'player1' },
    ]);
    expect(checkWinner(board, 'player1', 3)).toBe(true);
    expect(checkWinner(board, 'player2', 3)).toBe(false);

    const path = getWinningPath(board, 'player1', 3);
    expect(path.length).toBeGreaterThanOrEqual(3);
  });

  it('detects player2 left-to-right win on a 3×3 board', () => {
    const board = boardWith(3, [
      { row: 1, col: 0, player: 'player2' },
      { row: 1, col: 1, player: 'player2' },
      { row: 1, col: 2, player: 'player2' },
    ]);
    expect(checkWinner(board, 'player2', 3)).toBe(true);
    const path = getWinningPath(board, 'player2', 3);
    expect(path.length).toBeGreaterThanOrEqual(3);
  });

  it('makeMove ends the game when the connecting stone is placed', () => {
    let state = createInitialState(3);
    // Fill a nearly complete P1 column, leaving bottom for the winning move
    state = {
      ...state,
      board: boardWith(3, [
        { row: 0, col: 0, player: 'player1' },
        { row: 1, col: 0, player: 'player1' },
      ]),
      currentPlayer: 'player1',
    };
    const won = makeMove(state, { row: 2, col: 0 });
    expect(won.winner).toBe('player1');
    expect(getValidMoves(won)).toEqual([]);
  });

  it('getWinningPath is empty when there is no winner', () => {
    const board = boardWith(3, [{ row: 0, col: 0, player: 'player1' }]);
    expect(getWinningPath(board, 'player1', 3)).toEqual([]);
  });
});
