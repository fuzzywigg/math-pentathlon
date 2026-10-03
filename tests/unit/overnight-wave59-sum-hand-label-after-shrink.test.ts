/**
 * Wave 59 Contig/SD residual — Sum hand label after shrink. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 59 sum — hand label shrink', () => {
  it('shows Blue (3 left) after hand shrink', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      hands: {
        ...ctrl.state.hands,
        player1: ctrl.state.hands.player1.slice(0, 3),
      },
    };
    ctrl.update();
    expect(root.querySelector('.sd-hand-label.player1')?.textContent).toMatch(
      /Blue \(3 left\)/
    );
  });
});
