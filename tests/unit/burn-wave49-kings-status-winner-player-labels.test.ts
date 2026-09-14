/**
 * Wave 49 — Kings hvh Player 1/2 winner labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — hvh winners', () => {
  it('labels Player 1/2', () => {
    const box = document.createElement('div');
    renderStatus(
      { ...createInitialGameState(), winner: 'player1', turnPhase: 'gameOver' },
      box,
      'human-vs-human'
    );
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/Player 1 Wins/);
  });
});
