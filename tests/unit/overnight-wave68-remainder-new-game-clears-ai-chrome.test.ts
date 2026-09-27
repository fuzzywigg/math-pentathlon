/**
 * Wave 68 Remainder residual — newGameVsHuman clears AI chrome after VsAI. Tests-only.
 * Mirrors Contig wave 59 clear path for Remainder controller syncOpponentChrome.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

describe('Wave 68 remainder — clear AI chrome', () => {
  it('newGameVsHuman clears opponent dataset after AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    app.appendChild(container);

    initGame(container);
    newGameVsAI('medium');
    expect(app.dataset.opponent).toBe('ai');

    newGameVsHuman();

    expect(app.dataset.opponent || '').not.toBe('ai');
    expect(app.dataset.aiSeat).toBeUndefined();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(getCurrentState().phase).toBe('rolling');
    expect(container.querySelector('.remainder-btn-roll')).toBeTruthy();
    expect(container.querySelector('.remainder-status.player1')).toBeTruthy();
  });
});
