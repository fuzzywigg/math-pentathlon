/**
 * Wave 55 leftover after #250 — Kings place-phase empty cell via click. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 55 kings — place via click', () => {
  it('empty place after king move completes turn', () => {
    const moved = moveKing(selectKing(createInitialGameState()), { row: 2, col: 5 });
    const placed = handleCellClick(5, 5, moved);
    expect(placed.isInvalidClick).toBe(false);
    expect(placed.state.turnPhase).toBe('moveKing');
    expect(placed.state.currentPlayer).toBe('player2');
    expect(placed.state.board[4][4]?.type).toBe('quadraphage');
  });
});
