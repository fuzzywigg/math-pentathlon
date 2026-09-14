/**
 * Wave 58 leftover after #275 — Sum winner omits controls. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — winner omits controls', () => {
  it('gameOver winner path omits .sd-controls', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.sd-winner-banner')).toBeTruthy();
    expect(root.querySelector('.sd-controls')).toBeNull();
  });
});
