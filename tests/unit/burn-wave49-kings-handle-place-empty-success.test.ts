/**
 * Wave 49 — Kings handleCellClick place on empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — place empty', () => {
  it('places without invalid flag', () => {
    const s = { ...createInitialGameState(), turnPhase: 'placeQuadraphage' as const };
    const result = handleCellClick(4, 4, s);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state.board[3][3]?.type).toBe('quadraphage');
  });
});
