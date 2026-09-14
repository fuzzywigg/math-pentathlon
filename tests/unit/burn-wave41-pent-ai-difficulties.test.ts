/**
 * Wave 41 — Pent'Em In AI difficulty leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { canPlacePiece, placePiece } from '../../src/games/pent-em-in/rules';
import { getAIMove, isAITurn } from '../../src/games/pent-em-in/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 Pent AI — gates', () => {
  it('isAITurn matrix', () => {
    const s = createInitialState();
    expect(isAITurn(s, 'player1')).toBe(true);
    expect(isAITurn(s, 'player2')).toBe(false);
    expect(isAITurn(s, null)).toBe(false);
    expect(isAITurn({ ...s, phase: 'gameOver' }, 'player1')).toBe(false);
    expect(isAITurn({ ...s, currentPlayer: 'player2' }, 'player2')).toBe(true);
  });

  it('getAIMove null wrong seat / gameOver / no moves', () => {
    const s = createInitialState();
    expect(getAIMove(s, 'player2', 'hard')).toBeNull();
    expect(
      getAIMove({ ...s, phase: 'gameOver', winner: 'player1' }, 'player1', 'easy')
    ).toBeNull();
    const jammed = createInitialState();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        jammed.board[r][c] = {
          row: r,
          col: c,
          occupied: true,
          owner: 'player2',
          pieceId: 'jam',
        };
      }
    }
    expect(getAIMove(jammed, 'player1', 'medium')).toBeNull();
  });
});

describe('Wave 41 Pent AI — difficulties', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    'difficulty %s returns placeable move on open board',
    (difficulty) => {
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const state = createInitialState();
      const move = getAIMove(state, 'player1', difficulty);
      expect(move).not.toBeNull();
      expect(state.player1Pieces.available).toContain(move!.shapeId);
      expect(
        canPlacePiece(
          state,
          move!.shapeId,
          move!.position,
          move!.rotation,
          move!.flipped
        )
      ).toBe(true);
    }
  );

  it('randomness seed 0 still produces a legal placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.position.row).toBeGreaterThanOrEqual(0);
    expect(move!.position.col).toBeGreaterThanOrEqual(0);
  });

  it('applying AI move advances history and seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = placePiece(
      state,
      move!.shapeId,
      move!.position,
      move!.rotation,
      move!.flipped
    );
    expect(next.moveHistory).toHaveLength(1);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(
      true
    );
  });

  it('player2 AI move after p1 place stays on board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = createInitialState();
    const p1 = getAIMove(state, 'player1', 'medium');
    expect(p1).not.toBeNull();
    state = placePiece(
      state,
      p1!.shapeId,
      p1!.position,
      p1!.rotation,
      p1!.flipped
    );
    if (state.phase === 'gameOver') return;
    const p2 = getAIMove(state, 'player2', 'medium');
    expect(p2).not.toBeNull();
    expect(
      canPlacePiece(
        state,
        p2!.shapeId,
        p2!.position,
        p2!.rotation,
        p2!.flipped
      )
    ).toBe(true);
  });
});
