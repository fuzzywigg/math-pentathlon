/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum controller pass copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 sum — controller pass copy', () => {
  it('passing phase status + Pass Turn leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctl = initGame(root);
    ctl.state = { ...ctl.state, phase: 'passing', currentDice: [1, 1] };
    ctl.update();
    expect(root.querySelector('.sd-status')?.textContent).toMatch(
      /cannot play - must pass/
    );
    expect(root.querySelector('.sd-pass-btn')?.textContent).toBe('Pass Turn');
  });
});
