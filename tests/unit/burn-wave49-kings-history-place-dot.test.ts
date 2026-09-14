/**
 * Wave 49 — Kings history placeQuadraphage dot. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — history place', () => {
  it('shows place glyph', () => {
    const s = createInitialGameState();
    s.moveHistory = [
      { player: 'player1', action: 'placeQuadraphage', to: { row: 3, col: 3 } },
    ];
    const box = document.createElement('div');
    renderMoveHistory(s, box);
    expect(box.querySelector('.move-history-entry')?.textContent).toContain('●');
    expect(box.textContent).toMatch(/C3/);
  });
});
