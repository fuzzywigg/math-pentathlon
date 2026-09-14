/**
 * Wave 49 leftover after #221/#226/#227 — Kings handleCellClick gameOver noop. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — gameOver click', () => {
  it('ignores clicks when turnPhase is gameOver', () => {
    const state = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    const result = handleCellClick(5, 5, state);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state).toBe(state);
  });
});
