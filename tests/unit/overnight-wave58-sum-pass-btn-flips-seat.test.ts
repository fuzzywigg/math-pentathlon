/**
 * Wave 58 leftover after #275 — Sum pass btn flips seat. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — pass btn flips seat', () => {
  it('Pass Turn click advances seat after passTurn', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const before = ctrl.state.currentPlayer;
    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      winner: null,
      passCount: 0,
    };
    ctrl.update();
    (root.querySelector('.sd-pass-btn') as HTMLButtonElement).click();
    expect(ctrl.state.currentPlayer).not.toBe(before);
  });
});
