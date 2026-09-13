import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, HexGameState } from '../../src/games/hex/types';
import {
  isValidMove,
  makeMove,
  checkWinner,
  getValidMoves,
  getWinningPath,
} from '../../src/games/hex/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function withBoard(
  size: number,
  cells: Array<{ row: number; col: number; player: 'player1' | 'player2' }>
): HexGameState {
  const state = createInitialState(size);
  const board = state.board.map((row) => [...row]);
  for (const { row, col, player } of cells) {
    board[row][col] = player;
  }
  return { ...state, board };
}

describe('Hex – isValidMove / makeMove', () => {
  it('allows a move on an empty board cell', () => {
    const state = createInitialState(3);
    expect(isValidMove(state, { row: 1, col: 1 })).toBe(true);
  });

  it('makeMove places chip and flips player', () => {
    const state = createInitialState(3);
    const next = makeMove(state, { row: 0, col: 0 });

    expect(next.board[0][0]).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.winner).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next).not.toBe(state);
  });

  it('illegal occupied cell returns the same state reference', () => {
    let state = createInitialState(3);
    state = makeMove(state, { row: 0, col: 0 });
    const before = state;
    const next = makeMove(state, { row: 0, col: 0 });

    expect(next).toBe(before);
  });
});

describe('Hex – win detection', () => {
  it('detects player1 vertical path win on 3x3', () => {
    // P1 connects top (row 0) to bottom (row 2)
    let state = createInitialState(3);
    state = makeMove(state, { row: 0, col: 0 }); // P1
    state = makeMove(state, { row: 0, col: 1 }); // P2
    state = makeMove(state, { row: 1, col: 0 }); // P1
    state = makeMove(state, { row: 0, col: 2 }); // P2
    state = makeMove(state, { row: 2, col: 0 }); // P1 completes vertical

    expect(checkWinner(state.board, 'player1', 3)).toBe(true);
    expect(state.winner).toBe('player1');
  });

  it('detects player2 horizontal path win on 3x3', () => {
    // P2 connects left (col 0) to right (col 2)
    let state = createInitialState(3);
    state = makeMove(state, { row: 1, col: 1 }); // P1 distractor
    state = makeMove(state, { row: 0, col: 0 }); // P2
    state = makeMove(state, { row: 2, col: 2 }); // P1 distractor
    state = makeMove(state, { row: 0, col: 1 }); // P2
    state = makeMove(state, { row: 2, col: 1 }); // P1 distractor
    state = makeMove(state, { row: 0, col: 2 }); // P2 completes horizontal

    expect(checkWinner(state.board, 'player2', 3)).toBe(true);
    expect(state.winner).toBe('player2');
  });

  it('getWinningPath length is at least boardSize when won', () => {
    const boardSize = 3;
    const state = withBoard(boardSize, [
      { row: 0, col: 1, player: 'player1' },
      { row: 1, col: 1, player: 'player1' },
      { row: 2, col: 1, player: 'player1' },
    ]);

    expect(checkWinner(state.board, 'player1', boardSize)).toBe(true);
    const path = getWinningPath(state.board, 'player1', boardSize);
    expect(path.length).toBeGreaterThanOrEqual(boardSize);
  });

  it('getValidMoves is empty when winner is set', () => {
    const state: HexGameState = {
      ...withBoard(3, [
        { row: 0, col: 0, player: 'player1' },
        { row: 1, col: 0, player: 'player1' },
        { row: 2, col: 0, player: 'player1' },
      ]),
      winner: 'player1',
    };

    expect(getValidMoves(state)).toEqual([]);
  });
});
