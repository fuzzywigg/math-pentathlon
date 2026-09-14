/**
 * Wave 49 — Kings HvH Player 1 Wins leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 kings — HvH Player 1 Wins', () => {
  it('shows Player 1 Wins in human-vs-human mode', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(
      { ...createInitialGameState(), turnPhase: 'gameOver', winner: 'player1' },
      el,
      'human-vs-human'
    );
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/Player 1 Wins!/);
  });
});
