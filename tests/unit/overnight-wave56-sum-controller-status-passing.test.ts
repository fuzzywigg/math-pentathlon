/**
 * Wave 56 leftover after #243 — Sum Dominoes controller passing status residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller status passing', () => {
  it('shows must-pass copy and Pass Turn button', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = initGame(root, false);
    ctrl.state = { ...ctrl.state, phase: 'passing', currentDice: [1, 1] };
    ctrl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /cannot play - must pass/
    );
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
