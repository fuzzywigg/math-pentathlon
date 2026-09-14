/**
 * Wave 56 leftover after #256 — Par 55 controller Blue wins status + banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — win chrome', () => {
  it('Blue wins! status and Blue Wins! banner', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: 'player1' };
    ctrl.update();
    expect(el.querySelector('.par55-status')?.textContent).toMatch(/Blue wins!/);
    expect(el.querySelector('.par55-winner-banner')?.textContent).toBe(
      'Blue Wins! 🎉'
    );
  });
});
