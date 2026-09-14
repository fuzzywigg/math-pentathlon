/**
 * Wave 57 leftover after #267 — Sum winner banner + status copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — winner banner copy', () => {
  it('renders Blue wins status and Blue Wins! banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(/Blue wins!/);
    expect(root.querySelector('.sd-winner-banner')?.textContent).toMatch(
      /Blue Wins! 🎉/
    );
    expect(root.querySelector('.sd-winner-banner')?.classList.contains('game-winner-banner')).toBe(
      true
    );
  });
});
