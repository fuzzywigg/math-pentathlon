/**
 * Wave 58 Contig/SD residual — Sum Red winner banner + status. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — Red winner banner', () => {
  it('renders Red wins status and Red Wins! banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: 'player2' };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(/Red wins!/);
    expect(root.querySelector('.sd-winner-banner')?.textContent).toMatch(
      /Red Wins! 🎉/
    );
  });
});
