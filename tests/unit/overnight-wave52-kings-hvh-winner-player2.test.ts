/**
 * Wave 52 — Kings HvH Red wins leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — Red wins', () => {
  it('shows Red wins in human-vs-human', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(
      { ...createInitialGameState(), winner: 'player2', turnPhase: 'gameOver' },
      el,
      'human-vs-human'
    );
    expect(el.querySelector('.status-winner')?.textContent).toMatch(
      /Red wins!/
    );
  });
});
