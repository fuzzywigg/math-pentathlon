/**
 * Wave 69 leftover after tip/#350 — Star Track newGameVsAI stamps #app chrome.
 * Soft VsAI mode smoke existed; lock dataset/class + draw CTA. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getGameState,
} from '../../src/games/star-track/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 69 star-track — newGameVsAI chrome', () => {
  it('sets data-opponent=ai and game-vs-ai on #app with draw CTA', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);
    newGameVsAI('medium');

    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player2');
    expect(app.classList.contains('game-vs-ai')).toBe(true);
    expect(getGameState().phase).toBe('drawChains');
    expect(getGameState().currentPlayer).toBe('player1');
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();
    expect(status.querySelector('.star-track-status')).toBeTruthy();
  });
});
