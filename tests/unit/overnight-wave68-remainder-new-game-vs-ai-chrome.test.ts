/**
 * Wave 68 Remainder residual — newGameVsAI stamps #app AI chrome. Tests-only.
 * Contig wave 58 covered this path; Remainder only smoked VsAI without dataset asserts.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

describe('Wave 68 remainder — newGameVsAI chrome', () => {
  it('sets data-opponent=ai and game-vs-ai on #app with rolling CTA', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const container = document.createElement('div');
    app.appendChild(container);

    initGame(container);
    newGameVsAI('medium');

    expect(app.dataset.opponent).toBe('ai');
    expect(app.dataset.aiSeat).toBe('player2');
    expect(app.classList.contains('game-vs-ai')).toBe(true);
    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(container.querySelector('.remainder-btn-roll')).toBeTruthy();
    expect(
      container.querySelector('.remainder-status.player1')?.textContent
    ).toMatch(/Blue|turn/i);
  });
});
