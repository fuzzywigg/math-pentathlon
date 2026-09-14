/**
 * Wave 58 Contig/SD residual — Sum roll disabled when winner set. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — roll disabled with winner', () => {
  it('disables roll when phase rolling but winner set', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'rolling',
      winner: 'player1',
      currentDice: null,
    };
    ctrl.update();
    const btn = root.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
