/**
 * Wave 42 — Pent'Em In AI prefers winning move on nearly trapped opponent leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { getAIMove } from '../../src/games/pent-em-in/ai';
import { placePiece } from '../../src/games/pent-em-in/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe('Wave 42 pent-em-in — AI winning move preference', () => {
  it('hard AI chooses I5 fill that traps opponent (random disabled)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    leaveHorizontalRun(state, 0, 0, 5);
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };

    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBe('I5');
    expect(move!.position).toEqual({ row: 0, col: 0 });
    expect(move!.rotation).toBe(0);

    const after = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(after.winner).toBe('player1');
  });

  it('hard AI on open board does not claim premature win', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const after = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(after.winner).toBeNull();
  });
});
