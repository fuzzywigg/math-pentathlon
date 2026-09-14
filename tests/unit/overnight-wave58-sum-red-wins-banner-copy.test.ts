/**
 * Wave 58 leftover after #275 — Sum Red wins banner copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — Red wins banner', () => {
  it('renders Red wins status and Red Wins! banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(/Red wins!/);
    expect(root.querySelector('.sd-winner-banner')?.textContent).toMatch(
      /Red Wins! 🎉/
    );
    expect(
      root.querySelector('.sd-winner-banner')?.classList.contains('game-winner-banner')
    ).toBe(true);
  });
});
