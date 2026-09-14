/**
 * Wave 56 leftover after #256 — Kings place on occupied is invalid. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 56 kings — place occupied', () => {
  it('placing on king cell is invalid click', () => {
    const moved = moveKing(selectKing(createInitialGameState()), { row: 2, col: 5 });
    expect(moved.turnPhase).toBe('placeQuadraphage');
    const hit = handleCellClick(2, 5, moved);
    expect(hit.isInvalidClick).toBe(true);
    expect(hit.state).toBe(moved);
  });
});
