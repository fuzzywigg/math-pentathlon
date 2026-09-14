/**
 * Wave 49 — Star Track board winner banner leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

afterEach(() => { document.body.innerHTML = ''; });

describe('Wave 49 star-track — board winner banner', () => {
  it('shows Blue reaches the star banner on gameOver', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderBoard(
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
        player1Position: TRACK_LENGTH,
      },
      container
    );
    expect(container.querySelector('.star-track-winner')?.textContent).toMatch(/Blue reaches the star/);
  });
});
