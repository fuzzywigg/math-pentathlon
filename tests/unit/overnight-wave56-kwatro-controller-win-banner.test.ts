/**
 * Wave 56 leftover after #256 — Kwatro win status + banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 56 kwatro — win chrome', () => {
  it('Blue wins! status and Blue Wins! banner', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: {
        expression: '6 + 3 - 5 = 4',
        result: 4,
        nodes: [],
        chips: [],
      },
    };
    ctrl.update();
    expect(el.querySelector('.kwa-status')?.textContent).toMatch(/Blue wins!/);
    expect(el.querySelector('.kwa-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
    expect(el.querySelector('.kwa-winning-expr')?.textContent).toBe(
      '6 + 3 - 5 = 4'
    );
  });
});
