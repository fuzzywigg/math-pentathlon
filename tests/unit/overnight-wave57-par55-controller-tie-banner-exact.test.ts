/**
 * Wave 57 leftover after #263 — Par 55 tie status + banner exact. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/par-55/game-controller';

describe('Wave 57 par55 — tie banner', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('par55-styles')?.remove();
  });

  it("gameOver winner null shows It's a tie! + Tie banner", () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    ctrl.state = { ...ctrl.state, phase: 'gameOver', winner: null };
    ctrl.update();
    expect(root.querySelector('.par55-status')?.textContent).toBe("It's a tie!");
    expect(root.querySelector('.par55-winner-banner')?.textContent).toBe(
      "It's a Tie! 🤝"
    );
  });
});
