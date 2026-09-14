/**
 * Wave 49 — Kings gameOver clicks ignored. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — gameOver ignore', () => {
  it('does not mutate on gameOver', () => {
    const s = { ...createInitialGameState(), turnPhase: 'gameOver' as const, winner: 'player1' as const };
    const result = handleCellClick(1, 5, s);
    expect(result.state).toBe(s);
    expect(result.isInvalidClick).toBe(false);
  });
});
