/**
 * Wave 57 leftover after #263 — Kings place on occupied cell invalid. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 57 kings — place occupied invalid', () => {
  it('place-phase click on opponent king is invalid', () => {
    const moved = moveKing(selectKing(createInitialGameState()), {
      row: 2,
      col: 5,
    });
    expect(moved.turnPhase).toBe('placeQuadraphage');
    const result = handleCellClick(9, 5, moved);
    expect(result.isInvalidClick).toBe(true);
    expect(result.state.turnPhase).toBe('placeQuadraphage');
  });
});
