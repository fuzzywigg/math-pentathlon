/**
 * Wave 56 leftover after #256 — Kings gameOver clicks are no-ops. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 56 kings — gameOver click', () => {
  it('ignores clicks when turnPhase is gameOver', () => {
    const over = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const next = handleCellClick(1, 5, over);
    expect(next.state).toBe(over);
    expect(next.isInvalidClick).toBe(false);
  });
});
