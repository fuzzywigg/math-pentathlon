/**
 * Wave 58 leftover after #275 — Sum null winner omits banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — null winner omits banner', () => {
  it('gameOver with null winner mounts no banner', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: null,
    };
    ctrl.update();
    expect(root.querySelector('.sd-winner-banner')).toBeNull();
    expect(root.querySelector('.sd-status')?.textContent ?? '').toBe('');
  });
});
