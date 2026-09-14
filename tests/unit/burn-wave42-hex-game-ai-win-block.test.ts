/**
 * Wave 42 — Hex game AI blocks immediate opponent win.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove, checkWinner } from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 hex game — AI block / win', () => {
  it('hard AI takes immediate connecting win for player1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // size 3: p1 has col0 rows 0,1 empty → must play (2,0) to win
    let state = createInitialState(3);
    state = {
      ...state,
      board: state.board.map((row, r) =>
        row.map((cell, c) => {
          if (c === 0 && (r === 0 || r === 1)) return 'player1';
          return cell;
        })
      ),
      currentPlayer: 'player1',
      moveHistory: [
        { player: 'player1', position: { row: 0, col: 0 }, moveNumber: 1 },
        { player: 'player2', position: { row: 0, col: 1 }, moveNumber: 2 },
        { player: 'player1', position: { row: 1, col: 0 }, moveNumber: 3 },
        { player: 'player2', position: { row: 1, col: 1 }, moveNumber: 4 },
      ],
    };
    // Place a p2 stone so board isn't "opening center" path
    state.board[0][2] = 'player2';
    const move = getBestMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const after = makeMove(state, move!);
    expect(after.winner).toBe('player1');
    expect(checkWinner(after.board, 'player1', 3)).toBe(true);
  });

  it('medium AI returns legal empty cell midgame', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    state = makeMove(state, { row: 2, col: 1 });
    const move = getBestMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(state.board[move!.row][move!.col]).toBeNull();
  });
});
