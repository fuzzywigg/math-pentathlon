/**
 * Wave 49 — Kings cell-trapped class leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — trapped class', () => {
  it('marks loser king cell-trapped on gameOver', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    renderBoard(state, container);
    // loser is player2 king at row 9 col 5 (1-based)
    const trapped = container.querySelector('.cell[data-row="9"][data-col="5"]');
    expect(trapped?.classList.contains('cell-trapped')).toBe(true);
  });
});
