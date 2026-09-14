/**
 * Wave 52 — Kings board phase-* class leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 kings — phase class', () => {
  it('sets phase-moveKing / placeQuadraphage / gameOver on board', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(createInitialGameState(), container);
    expect(container.querySelector('.board.phase-moveKing')).toBeTruthy();

    renderBoard(
      { ...createInitialGameState(), turnPhase: 'placeQuadraphage' },
      container
    );
    expect(
      container.querySelector('.board.phase-placeQuadraphage')
    ).toBeTruthy();

    renderBoard(
      {
        ...createInitialGameState(),
        turnPhase: 'gameOver',
        winner: 'player1',
      },
      container
    );
    expect(container.querySelector('.board.phase-gameOver')).toBeTruthy();
  });
});
