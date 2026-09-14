/**
 * Wave 56 leftover after #243 — Sum Dominoes controller select status residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller status select', () => {
  it('shows Select a domino when placing with no selection', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root, false);
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [2, 5],
      selectedDomino: null,
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Select a domino to play/
    );
  });
});
