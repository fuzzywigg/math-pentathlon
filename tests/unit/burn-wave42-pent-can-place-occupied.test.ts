/**
 * Wave 42 — Pent'Em In canPlacePiece occupied-after-forge leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { canPlacePiece, placePiece } from '../../src/games/pent-em-in/rules';

function occupyAllExcept(
  state: ReturnType<typeof createInitialState>,
  holes: { row: number; col: number }[]
) {
  const holeSet = new Set(holes.map((h) => `${h.row},${h.col}`));
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (!holeSet.has(`${r},${c}`)) {
        state.board[r][c] = {
          row: r,
          col: c,
          occupied: true,
          owner: 'player2',
          pieceId: 'forge-block',
        };
      }
    }
  }
}

describe('Wave 42 pent-em-in — canPlacePiece occupied cells', () => {
  it('false when any target cell is occupied after forge', () => {
    let state = createInitialState();
    state = placePiece(state, 'X', { row: 3, col: 3 }, 0, false);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    expect(canPlacePiece(state, 'F', { row: 3, col: 3 }, 0, false)).toBe(
      false
    );
    expect(canPlacePiece(state, 'V', { row: 4, col: 4 }, 0, false)).toBe(
      false
    );
  });

  it('false when forged jam overlaps a horizontal I5 slot', () => {
    const state = createInitialState();
    occupyAllExcept(state, [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ]);
    state.board[0][2] = {
      row: 0,
      col: 2,
      occupied: true,
      owner: 'player1',
      pieceId: 'mid-block',
    };
    expect(canPlacePiece(state, 'I5', { row: 0, col: 0 }, 0, false)).toBe(
      false
    );
  });
});
