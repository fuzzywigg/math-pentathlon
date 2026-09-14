/**
 * Wave 56 leftover after #256 — Kings re-click selected king deselects. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState, selectKing } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 56 kings — deselect king', () => {
  it('re-click own selected king clears selection', () => {
    const selected = selectKing(createInitialGameState());
    expect(selected.selectedKingPosition).toEqual({ row: 1, col: 5 });
    const next = handleCellClick(1, 5, selected);
    expect(next.state.selectedKingPosition).toBeNull();
    expect(next.isInvalidClick).toBe(false);
  });
});
