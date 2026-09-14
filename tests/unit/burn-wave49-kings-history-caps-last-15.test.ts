/**
 * Wave 49 — Kings history caps at last 15. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — history cap', () => {
  it('lists at most 15 entries', () => {
    const s = createInitialGameState();
    s.moveHistory = Array.from({ length: 20 }, (_, i) => ({
      player: (i % 2 === 0 ? 'player1' : 'player2') as 'player1' | 'player2',
      action: 'placeQuadraphage' as const,
      to: { row: 1 + (i % 9), col: 1 + ((i * 3) % 9) },
    }));
    const box = document.createElement('div');
    renderMoveHistory(s, box);
    expect(box.querySelectorAll('.move-history-entry').length).toBe(15);
  });
});
