/**
 * Wave 55 leftover after #250 — Kings click ignore without selection / opponent king. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 55 kings — ignore unselected clicks', () => {
  it('empty cell and opponent king do not select or flag invalid', () => {
    const state = createInitialGameState();
    const empty = handleCellClick(3, 3, state);
    expect(empty.isInvalidClick).toBe(false);
    expect(empty.state.selectedKingPosition).toBeNull();
    const opp = handleCellClick(9, 5, state);
    expect(opp.isInvalidClick).toBe(false);
    expect(opp.state.selectedKingPosition).toBeNull();
  });
});
