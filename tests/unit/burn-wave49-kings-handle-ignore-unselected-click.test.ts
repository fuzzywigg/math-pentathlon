/**
 * Wave 49 — Kings ignore click without king selected. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — ignore unselected', () => {
  it('empty click without selection is not invalid', () => {
    const s = createInitialGameState();
    const result = handleCellClick(4, 4, s);
    expect(result.isInvalidClick).toBe(false);
    expect(result.state).toBe(s);
  });
});
