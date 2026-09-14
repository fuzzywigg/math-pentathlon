/**
 * Wave 42 leftovers D — Hex-a-Gone place win full board. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
  isGameOver,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 42 D hexagone — placeBlock win via full board', () => {
  it('last empty cell placement ends game for the placer', () => {
    let state = createInitialState();
    // Fill all but one cell
    const last = state.board[state.board.length - 1];
    state = {
      ...state,
      board: state.board.map((cell) =>
        cell.q === last.q && cell.r === last.r
          ? cell
          : {
              ...cell,
              filled: true,
              filledBy: 'player2' as const,
              blockId: 1,
            }
      ),
    };

    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    state = placeBlock(state, last.q, last.r);

    expect(isGameOver(state)).toBe(true);
    expect(state.phase).toBe('gameOver');
    expect(state.winner).toBe('player1');
  });
});
