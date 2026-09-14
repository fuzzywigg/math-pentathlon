/**
 * Wave 42 — Kings getBestMove / getRandomMove / evaluatePosition / isAITurn.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getBestMove,
  getRandomMove,
  evaluatePosition,
  isAITurn,
} from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import {
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import type { GameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — AI helper matrix', () => {
  it('getBestMove / getRandomMove return AIMove on opening', () => {
    const state = createInitialGameState();
    const best = getBestMove(state, 'player1', 'hard');
    const rand = getRandomMove(state, 'player1');
    expect(best).not.toBeNull();
    expect(rand).not.toBeNull();
    expect(best!.kingMove).toBeDefined();
    expect(rand!.quadraphagePlacement).toBeDefined();
  });

  it('evaluatePosition opening is finite; trapped opponent = 10000', () => {
    const state = createInitialGameState();
    const score = evaluatePosition(state, 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(10000);

    const board = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    const king = findKingPosition(board, 'player2')!;
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        if (dr === 0 && dc === 0) continue;
        const r = king.row + dr;
        const c = king.col + dc;
        if (r < 0 || r > 8 || c < 0 || c > 8) continue;
        if (board[r][c]?.type === 'king') continue;
        board[r][c] = { type: 'quadraphage', owner: 'player1' };
      }
    }
    const trapped: GameState = { ...state, board };
    expect(getValidKingMoves(trapped, 'player2')).toHaveLength(0);
    expect(evaluatePosition(trapped, 'player1')).toBe(10000);
    expect(evaluatePosition(trapped, 'player2')).toBe(-10000);
  });

  it('isAITurn gates mode / seat / gameOver', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    const over = {
      ...state,
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });
});
