/**
 * Wave 58 Contig/SD residual — Sum gameOver omits pass btn. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — gameOver no pass', () => {
  it('winner mount has banner and no pass button', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: 'player1' };
    ctrl.update();
    expect(root.querySelector('.sd-winner-banner')).toBeTruthy();
    expect(root.querySelector('.sd-pass-btn')).toBeNull();
  });
});
