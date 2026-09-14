/**
 * Wave 57 leftover after #267 — Sum place-position status after select. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — status place position', () => {
  it('selected domino status asks for valid position', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    const tile = ctrl.state.hands.player1[0]!;
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: tile.id,
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /Click a valid position to place/
    );
  });
});
