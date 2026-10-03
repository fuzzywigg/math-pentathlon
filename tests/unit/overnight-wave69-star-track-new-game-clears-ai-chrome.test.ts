/**
 * Wave 69 leftover after tip/#350 — Star Track vsHuman clears AI chrome.
 * Soft mode flip existed; lock dataset clear after VsAI. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
} from '../../src/games/star-track/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 69 star-track — newGameVsHuman clears AI chrome', () => {
  it('clears data-opponent and game-vs-ai after prior VsAI', () => {
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
    expect(app.classList.contains('game-vs-ai')).toBe(true);

    newGameVsHuman();
    expect(app.dataset.opponent).toBeUndefined();
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();
  });
});
