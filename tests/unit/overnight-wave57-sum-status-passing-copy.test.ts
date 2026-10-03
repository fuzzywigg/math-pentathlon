/**
 * Wave 57 leftover after #267 — Sum passing status + Pass Turn btn. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 57 sum — status passing copy', () => {
  it('passing phase shows must-pass status and Pass Turn', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = {
      ...ctrl.state,
      phase: 'passing',
      currentDice: [1, 1],
      selectedDomino: null,
    };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /cannot play - must pass/
    );
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
