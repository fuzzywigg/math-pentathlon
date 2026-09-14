/**
 * Wave 52 — Star Track HvA You/AI Wins leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 star-track — You/AI Wins', () => {
  it('labels winners You and AI in human-vs-ai', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    renderStatus(
      {
        ...createInitialState(),
        winner: 'player1',
        player1Position: TRACK_LENGTH,
        phase: 'gameOver',
      },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/You Wins!/);

    renderStatus(
      {
        ...createInitialState(),
        winner: 'player2',
        player2Position: TRACK_LENGTH,
        phase: 'gameOver',
      },
      el,
      'human-vs-ai'
    );
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
  });
});
