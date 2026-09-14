/**
 * Wave 56 leftover after #243 — Sum Dominoes winner banner residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller winner banner', () => {
  it('paints Red Wins banner on player2 winner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root, false);
    ctrl.state = {
      ...ctrl.state,
      winner: 'player2',
      phase: 'gameOver',
    };
    ctrl.update();
    const banner = root.querySelector('.sd-winner-banner.game-winner-banner');
    expect(banner?.textContent).toMatch(/Red Wins!/);
    expect(banner?.textContent).toContain('🎉');
  });
});
