/**
 * Wave 52 — Star Track Red board banner leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — Red banner', () => {
  it('shows Red reaches the star on player2 gameOver', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player2',
        player2Position: TRACK_LENGTH,
      },
      container
    );
    expect(
      container.querySelector('.star-track-winner')?.textContent
    ).toMatch(/Red reaches the star/);
  });
});
