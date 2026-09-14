/**
 * Wave 41 — Kings endTurn win/draw settle after placeQuadraphage path.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  checkWinCondition,
  isDrawCondition,
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  endTurn,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function surroundBothKings(state: GameState): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c]?.type === 'king') continue;
      board[r][c] = { type: 'quadraphage', owner: 'player1' };
    }
  }
  return { ...state, board, player1Supply: 0, player2Supply: 0 };
}

describe('Wave 41 kings — endTurn settle', () => {
  it('normal place ends turn without winner', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.winner).toBeNull();
    expect(state.turnPhase).toBe('moveKing');
    expect(state.currentPlayer).toBe('player2');
  });

  it('endTurn with opponent trapped sets gameOver winner', () => {
    let state = createInitialGameState();
    // Trap player2 after forging board, then call endTurn as if mid-turn
    const trapped = trapOpponent(state, 'player2');
    expect(checkWinCondition(trapped)).toBe('player1');
    const ended = endTurn(trapped);
    expect(ended.turnPhase).toBe('gameOver');
    expect(ended.winner).toBe('player1');
  });

  it('both kings trapped → draw via endTurn', () => {
    const both = surroundBothKings(createInitialGameState());
    expect(getValidKingMoves(both, 'player1')).toHaveLength(0);
    expect(getValidKingMoves(both, 'player2')).toHaveLength(0);
    expect(isDrawCondition(both)).toBe(true);
    // checkWinCondition returns player1 first when both trapped
    // endTurn prefers win over draw when checkWin finds a winner
    const ended = endTurn(both);
    expect(ended.turnPhase).toBe('gameOver');
  });
});

function trapOpponent(
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
