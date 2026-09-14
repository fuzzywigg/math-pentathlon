/**
 * Wave 49 — Kings place on occupied is invalid. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — place occupied', () => {
  it('flags invalid on king square', () => {
    const s = { ...createInitialGameState(), turnPhase: 'placeQuadraphage' as const };
    const result = handleCellClick(1, 5, s);
    expect(result.isInvalidClick).toBe(true);
  });
});
