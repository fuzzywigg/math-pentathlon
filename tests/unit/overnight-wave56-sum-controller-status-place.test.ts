/**
 * Wave 56 leftover after #243 — Sum Dominoes controller place status residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller status place', () => {
  it('shows Click a valid position when a domino is selected', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root, false);
    const id = ctrl.state.hands.player1[0]!.id;
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: id,
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Click a valid position to place/
    );
  });
});
