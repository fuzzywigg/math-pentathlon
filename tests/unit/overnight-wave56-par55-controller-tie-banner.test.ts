/**
 * Wave 56 leftover after #256 — Par 55 tie status + banner. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 56 par55 — tie chrome', () => {
  it("It's a tie! status and It's a Tie! banner", () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const ctrl = newGameVsHuman(el);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: null };
    ctrl.update();
    expect(el.querySelector('.par55-status')?.textContent).toBe("It's a tie!");
    expect(el.querySelector('.par55-winner-banner')?.textContent).toBe(
      "It's a Tie! 🤝"
    );
  });
});
