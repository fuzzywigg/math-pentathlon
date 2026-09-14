/**
 * Wave 42 — Kings endTurn win / draw / continue matrix leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkWinCondition,
  isDrawCondition,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  endTurn,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function trap(
  state: GameState,
  victim: 'player1' | 'player2'
): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  const king = findKingPosition(board, victim)!;
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
  return { ...state, board };
}

describe('Wave 42 kings — endTurn settle leftovers', () => {
  it('continue advances opponent into moveKing', () => {
    const state = createInitialGameState();
    const next = endTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.turnPhase).toBe('moveKing');
    expect(next.winner).toBeNull();
  });

  it('win path sets gameOver + winner', () => {
    const trapped = trap(createInitialGameState(), 'player2');
    expect(checkWinCondition(trapped)).toBe('player1');
    const ended = endTurn(trapped);
    expect(ended.turnPhase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
    expect(ended.currentPlayer).toBe('player2');
  });

  it('both trapped: endTurn gameOver (win preferred over draw)', () => {
    let both = createInitialGameState();
    both = trap(both, 'player1');
    both = trap(both, 'player2');
    expect(isDrawCondition(both)).toBe(true);
    const ended = endTurn(both);
    expect(ended.turnPhase).toBe('gameOver');
    // checkWinCondition returns player1 when both trapped
    expect(ended.winner).toBe('player1');
  });
});
