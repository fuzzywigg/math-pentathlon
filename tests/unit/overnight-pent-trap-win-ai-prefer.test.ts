/**
 * Overnight HEAVY — Pent hard prefers I5 trap fill (seeded, no random).
 * Distinct leftover reinforcement of winning +10000 path. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

afterEach(() => vi.restoreAllMocks());

function leaveHorizontalRun(
  state: ReturnType<typeof createInitialState>,
  row: number,
  startCol: number,
  length: number
) {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const inRun = r === row && c >= startCol && c < startCol + length;
      state.board[r][c] = {
        row: r,
        col: c,
        occupied: !inRun,
        owner: inRun ? null : 'player2',
        pieceId: inRun ? null : 'wall',
      };
    }
  }
}

describe('Overnight pent — trap win prefer', () => {
  it('hard chooses I5 that traps when only a 5-wide corridor remains', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    let state = createInitialState();
    leaveHorizontalRun(state, 0, 0, 5);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBe('I5');
    const after = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(after.winner).toBe('player1');
  });
});
