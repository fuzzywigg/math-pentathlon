/**
 * Wave 49 — Kings history moveKing arrow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — history king move', () => {
  it('shows arrow between squares', () => {
    const s = createInitialGameState();
    s.moveHistory = [
      {
        player: 'player1',
        action: 'moveKing',
        from: { row: 1, col: 5 },
        to: { row: 2, col: 5 },
      },
    ];
    const box = document.createElement('div');
    renderMoveHistory(s, box);
    expect(box.querySelector('.move-history-entry')?.textContent).toMatch(/→/);
    expect(box.textContent).toMatch(/E1/);
    expect(box.textContent).toMatch(/E2/);
  });
});
