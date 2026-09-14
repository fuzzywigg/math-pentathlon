/**
 * Wave 58 leftover after #275 — Sum roll disabled when winner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — roll disabled winner', () => {
  it('Roll Dice disabled under winner leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'rolling',
      currentDice: null,
      winner: 'player1',
    };
    ctrl.update();
    const btn = root.querySelector('.sd-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
  });
});
