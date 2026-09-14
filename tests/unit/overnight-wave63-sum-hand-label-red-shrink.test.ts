/**
 * Wave 63 Contig/SD residual after tip #301 — Sum Red hand label shrink leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — hand label red shrink', () => {
  it('shows Red (2 left) after hand shrink', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      hands: {
        ...ctrl.state.hands,
        player2: ctrl.state.hands.player2.slice(0, 2),
      },
    };
    ctrl.update();
    expect(root.querySelector('.sd-hand-label.player2')?.textContent).toMatch(
      /Red \(2 left\)/
    );
  });
});
