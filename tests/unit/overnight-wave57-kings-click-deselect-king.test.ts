/**
 * Wave 57 leftover after #263 — Kings click deselects selected king. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 57 kings — deselect king', () => {
  it('click selected king clears selectedKingPosition', () => {
    const selected = selectKing(createInitialGameState());
    expect(selected.selectedKingPosition).toEqual({ row: 1, col: 5 });
    const result = handleCellClick(1, 5, selected);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state.selectedKingPosition).toBeNull();
  });
});
