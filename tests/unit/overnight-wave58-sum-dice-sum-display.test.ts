/**
 * Wave 58 leftover after #275 — Sum dice sum display. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 58 sum — dice sum display', () => {
  it('shows = N after dice present', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'placing',
      currentDice: [3, 4],
      selectedDomino: null,
    };
    ctrl.update();
    expect(root.querySelector('.sd-dice-sum')?.textContent).toBe('= 7');
  });
});
